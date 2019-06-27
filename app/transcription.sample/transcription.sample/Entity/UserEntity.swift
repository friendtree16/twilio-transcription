//
//  UserEntity.swift
//  transcription.sample
//
//  Created by 葛 智紀 on 2019/06/26.
//  Copyright © 2019 葛 智紀. All rights reserved.
//

import Firebase

struct UserEntity {
    var phoneNumber: String
    var texts: [TextEntity]?
    
    init(data: Dictionary<String, Any>) {
        self.phoneNumber = data["phoneNumber"] as! String
        
        let metaTexts:[Dictionary<String,Any>] = data["texts"] as! Array
        
        self.texts = metaTexts.map({TextEntity.init(data: $0)})
            .filter({ item in
                return item.text?.count != 0
            })
    }
    
    mutating func add(data: Dictionary<String, Any>?) {
        guard let data = data else {
            return
        }
        
        let metaTexts:[Dictionary<String,Any>] = data["texts"] as! Array
        
        let appendTexts:[TextEntity] = metaTexts.map({ row in
            TextEntity.init(data: row)
        }).filter({ textItem in
            guard let lastTimeStamp = self.texts?.last?.timeStamp else {
                return false
            }
            
            if textItem.timeStamp! <= lastTimeStamp {
                return false
            }
            
            if textItem.text?.count == 0 {
                return false
            }
            
            return true
            
        })
        
        if var texts = self.texts {
            texts += appendTexts
            self.texts = texts
        } else {
            self.texts = appendTexts
        }
    }
}

struct TextEntity {
    var callSid: String?
    var text: String?
    var timeStamp: Date?
    
    init(data: Dictionary<String,Any>) {
        if let callSid = data["callSid"] as? String {
            self.callSid = callSid
        }
        
        if let text = data["text"] as? String {
            self.text = text
        }
        
        if let timeStamp = data["timestamp"] as? Timestamp {
            self.timeStamp = timeStamp.dateValue()
        }
    }
}
