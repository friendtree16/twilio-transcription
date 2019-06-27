//
//  ViewController.swift
//  transcription.sample
//
//  Created by 葛 智紀 on 2019/06/26.
//  Copyright © 2019 葛 智紀. All rights reserved.
//

import UIKit

class ViewController: UIViewController {

    @IBOutlet weak var phoneNumberTextField: UITextField!
    
    override func viewDidLoad() {
        super.viewDidLoad()
        // Do any additional setup after loading the view.
    }

    @IBAction func displayConversationHistory(_ sender: Any) {
        
        guard let phoneNumber = self.phoneNumberTextField.text, phoneNumber.count != 0 else {
            showAlert(message: "電話番号を入力してください")
            return
        }
        
        let conversationHistoryViewController = self.storyboard?.instantiateViewController(withIdentifier: "ConversationHistory") as! ConversationHistoryViewController
        
        conversationHistoryViewController.phoneNumber = phoneNumber
        self.navigationController?.pushViewController(conversationHistoryViewController, animated: true)
        
    }
    
    func showAlert(message:String) {
        let dialog = UIAlertController(title: nil, message: message, preferredStyle: .alert)
        let okButton = UIAlertAction(title: "OK", style: UIAlertAction.Style.cancel, handler: nil)
        dialog.addAction(okButton)
        present(dialog, animated: true, completion: nil)
    }
    
}

