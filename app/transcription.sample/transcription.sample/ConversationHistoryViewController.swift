//
//  ConversationHistoryViewController.swift
//  transcription.sample
//
//  Created by 葛 智紀 on 2019/06/26.
//  Copyright © 2019 葛 智紀. All rights reserved.
//

import UIKit
import Firebase

let db = Firestore.firestore()

class ConversationHistoryViewController: ViewController {
    
    var phoneNumber:String = ""
    var userEntity: UserEntity?
    
    @IBOutlet weak var tableView: UITableView!
    
    override func viewDidLoad() {
        super.viewDidLoad()
        self.tableView.dataSource = self
        self.tableView.delegate = self
        
        self.navigationItem.title = phoneNumber
        
        db.collection("users").whereField("phoneNumber", isEqualTo: phoneNumber)
            .getDocuments() { (querySnapshot, err) in
            if let err = err {
                print("Error getting documents: \(err)")
            } else {
                guard querySnapshot?.documents.count != 0 else {
                    return
                }
                guard let document = querySnapshot?.documents[0] else {
                    return
                }
                
                self.userEntity = UserEntity.init(data: document.data())
                self.tableView.reloadData()
                
                self.listenWithMetadata(id: document.documentID)
            }
        }

        // Do any additional setup after loading the view.
    }
    
    private func listenWithMetadata(id:String) {
        // [START listen_with_metadata]
        // Listen to document metadata.
        
        db.collection("users").document(id)
            .addSnapshotListener(includeMetadataChanges:true) { documentSnapshot, error in
                guard let document = documentSnapshot else {
                    print("Error fetching document: \(error!)")
                    return
                }
                let source = document.metadata.hasPendingWrites ? "Local" : "Server"
                print("\(source) data: \(String(describing: document.data()))")
                
                self.userEntity?.add(data: document.data())
                self.tableView.reloadData()
                
        }
        // [END listen_with_metadata]
    }

}

extension ConversationHistoryViewController: UITableViewDataSource {
    func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        if let count = self.userEntity?.texts?.count {
            return count
        } else {
            return 0
        }
    }
    
    func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        let cell = tableView.dequeueReusableCell(withIdentifier: "Cell")
            ?? UITableViewCell(style: .default, reuseIdentifier: "Cell")
        
        if let items = userEntity?.texts {
            cell.textLabel?.text = items[indexPath.row].text
        }
        cell.textLabel?.numberOfLines=0
        return cell
    }
}

extension ConversationHistoryViewController: UITableViewDelegate {
    
}
