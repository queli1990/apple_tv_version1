//
//  AppDelegate.swift
//  YoYoVideo
//
//  Created by li que on 2017/2/20.
//  Copyright © 2017年 li que. All rights reserved.
//

import UIKit
import TVMLKit
import CryptoSwift
import Alamofire

var jsCallback = JSValue()


func isPurchased() -> Bool {
    return UserDefaults.standard.bool(forKey: "com.uu.VIP")
}

//用于获取js端传过来的参数。但是传来的是一个数组
func postUserAction () -> Bool{
    let array = JSContext.currentArguments()! as NSArray
//    let string = (array[0] as AnyObject).toString
//    let string = (array[0] as AnyObject).toString()
//    print(string!)
    
    let UUID = UIDevice.current.identifierForVendor?.uuidString  //deviceId
    let version = Bundle.main.infoDictionary?["CFBundleShortVersionString"]  //version
    let platform = "apple-tv"  //platform
    let ip = (array[0] as AnyObject).toString()  //ip
    let albumId = (array[1] as AnyObject).toString()  //albumId
    let albumTitleString = ((array[2] as AnyObject).toString())! //albumTitle
    let albumTitleUFT8 = albumTitleString.utf8
    
    
    let watchLength = (array[3] as AnyObject).toString()  //watchLength
    let isCollection = "0"  //isCollection
    let startTime = (array[4] as AnyObject).toString()  //startTime
    let endTime = (array[5] as AnyObject).toString()  //endTime
    let appendString = "\(UUID!)\(version!)\(platform)\(ip!)\(albumId!)\(albumTitleUFT8)\(watchLength!)\(isCollection)\(startTime!)\(endTime!)"
    let signString = appendString.md5()
    
    let paramsDic = ["deviceId":UUID!,"version":version!,"platform":platform,"ip":ip!,"albumId":albumId!,"albumTitle":albumTitleUFT8,"watchLength":watchLength!,"isCollection":isCollection,"startTime":startTime!,"endTime":endTime!,"sign":signString] as [String : Any]
    
    Alamofire.request("http://api.100uu.tv/app/member/doVideoStatistics.do", method: .post, parameters: paramsDic, encoding: URLEncoding.httpBody).responseJSON{ (response) in
        if let JSON = response.result.value {
            let resultDic = JSON as! NSDictionary
            print(resultDic["status"]!)
            print("JSON: \(JSON)")
        }
    }
    
    return true;
}

@UIApplicationMain
class AppDelegate: UIResponder, UIApplicationDelegate, TVApplicationControllerDelegate {

    var window: UIWindow?
    var appController: TVApplicationController?
    
    static let TVBaseURL = "http://localhost:9001/"
//    static let TVBaseURL = "http://47.93.83.7:8099/AppleTV-Versions/Version-1.1/server/"
//    static let TVBaseURL = "http://www.100uu.tv:8099/server/"
    static let TVBootURL = "\(AppDelegate.TVBaseURL)js/application.js"
    
    
    
    func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplicationLaunchOptionsKey : Any]? = nil) -> Bool {
        
        window = UIWindow(frame: UIScreen.main.bounds)
        
        // 1
        let appControllerContext = TVApplicationControllerContext()
        
        // 2
        guard let javaScriptURL = NSURL(string: AppDelegate.TVBootURL) else {
            fatalError("unable to create NSURL")
        }
        appControllerContext.javaScriptApplicationURL = javaScriptURL as URL
        appControllerContext.launchOptions["BASEURL"] = AppDelegate.TVBaseURL
        
        // 3
        appController = TVApplicationController(context: appControllerContext, window: window, delegate: self)
        
        IAP.requestProducts(Set<ProductIdentifier>(arrayLiteral: "com.uu.VIP"))
        validateSubscriptionIfNeeded()
        
        // Load Swift context into JavaScript
        loadInAppPurchaseView()
        
//        let alertController = UIAlertController(title: "系统提示",
//                                                message: AppDelegate.TVBootURL, preferredStyle: .alert)
//        let cancelAction = UIAlertAction(title: "取消", style: .cancel, handler: nil)
//        let okAction = UIAlertAction(title: "好的", style: .default, handler: {
//            action in
//            print("点击了确定")
//        })
//        
//        alertController.addAction(cancelAction)
//        alertController.addAction(okAction)
//        
//        window?.rootViewController?.present(alertController, animated: true, completion: nil)
        
        return true   
    }
    
    func validateSubscriptionIfNeeded() {
        let validatedAt = UserDefaults.standard.double(forKey: "receipt_validated_at")
        let now = NSDate().timeIntervalSince1970
        if (now - validatedAt < 86400) {
            return
        } 
        IAP.validateReceipt("f3a2caf8481e4db9a00f1ded035a034c") { (statusCode, products, receipt) in
            if (products == nil || products!.isEmpty) {
                UserDefaults.standard.set(false, forKey: "com.uu.VIP")
                UserDefaults.standard.synchronize()
                return
            }
            if let expireDate = products!["com.uu.VIP"] {
                if (expireDate.timeIntervalSince1970 < now) {
                    print("Subscription expired ...")
                    UserDefaults.standard.set(false, forKey: "com.uu.VIP")
                    UserDefaults.standard.synchronize()
                }
            }
        }
    }
    
    func loadInAppPurchaseView(){
        
        appController?.evaluate(inJavaScriptContext: {(evaluation: JSContext) -> Void in
            
            if let _jsCallback = evaluation.objectForKeyedSubscript("jsCallback") {
                jsCallback = _jsCallback
            }
            
            let pushNativeViewBlock : @convention(block) () -> Void = {
                () -> Void in
                DispatchQueue.main.async(execute: {
                    if let navController = self.appController?.navigationController {
                        let viewController = ViewController()
                        navController.pushViewController(viewController, animated: true)
                    }
                })
            }
            
            let jsIsPurchased : @convention(block) () -> Bool = {
                return isPurchased()
            }
            
            let bundleVersion: @convention(block) () -> Void = {
                return Bundle.main.infoDictionary?["CFBundleVersion"]
            }
            
            let postActive : @convention(block) () -> Bool = {
                return postUserAction()
            }
            
            evaluation.setObject(unsafeBitCast(pushNativeViewBlock, to: AnyObject.self), forKeyedSubscript: "pushNativeView" as (NSCopying & NSObjectProtocol)!)
            evaluation.setObject(unsafeBitCast(jsIsPurchased, to: AnyObject.self), forKeyedSubscript: "isPurchased" as (NSCopying & NSObjectProtocol)!)
            evaluation.setObject(unsafeBitCast(bundleVersion, to: AnyObject.self), forKeyedSubscript: "bundleVersion" as (NSCopying & NSObjectProtocol)!)
            //从js直接调用postActive方法就会走这个方法
            evaluation.setObject(unsafeBitCast(postActive, to: AnyObject.self), forKeyedSubscript: "postActive" as (NSCopying & NSObjectProtocol)!)

            
        }, completion: {(Bool) -> Void in
            //done running the script
        })
    }
    
    func applicationWillTerminate(_ application: UIApplication) {
        IAP.removeObserver()
    }
}



/*
 Alamofire的 get方法
 */
func getCurrentIP() {
//    let headers: HTTPHeaders = [
//        "Authorization": "XXXXXX",
//        "Accept": "application/json",
//        "Content-Type": "application/json"
//    ]
//    Alamofire.request("http://chaxun.1616.net/s.php?type=ip&output=json&callback=?&_=", method: .get, parameters: nil, encoding: JSONEncoding(options: []), headers: headers).responseJSON { response in
//        print(response)
//    }
    
    
    Alamofire.request("http://chaxun.1616.net/s.php?type=ip&output=json&callback=?&_=").responseJSON { (response) in
        print(response.request)
        print(response.response)
        print(response.data)
        print(response.result)
        
        if let data = response.data, let utf8Text = String(data:data, encoding:.utf8){
            print("Data:\(utf8Text)")
        }
        
        if let JSON = response.result.value {
            print("JSON: \(JSON)")
        }
    }
    
}

