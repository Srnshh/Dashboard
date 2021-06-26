class ChatEngine{
    constructor(userEmail,chatroom){
        
        this.userEmail = userEmail;
        this.chatroom = chatroom;
        console.log(this.userEmail,this.user2);

        this.socket = io.connect('http://10.248.1.133:5000');

        if (this.userEmail){
            this.connectionHandler();
        }

    }


    connectionHandler(){
        let self = this;

        this.socket.on('connect', function(){
            console.log('connection established using sockets...!');


            self.socket.emit('join_room', {
                user_email: self.userEmail,
                chatroom: self.chatroom
            });

            self.socket.on('user_joined', function(data){
                console.log('a user joined!', data);
            })


        });

        // CHANGE :: send a message on clicking the send message button
        $('#send-message').click(function(){
            let msg = $('#chat-message-input').val();

            if (msg != ''){
                self.socket.emit('send_message', {
                    message: msg,
                    user_email: self.userEmail,
                    chatroom: self.chatroom
                });
            }
        });

        self.socket.on('receive_message', function(data){
            console.log('message received', data.message);


            
       let messageType = $(`<div class="incoming_msg">
                <div class="incoming_msg_img"> <img src="https://ptetutorials.com/images/user-profile.png" alt="sunil"> </div>
                <div class="received_msg">
                  <div class="received_withd_msg">
                    <p>${data.message}</p>
                    <span class="time_date"> 11:01 AM    |    Yesterday</span></div>
                </div>
              </div>`);
            

           

            if (data.user_email == self.userEmail){
                messageType = $(`<div class="outgoing_msg">
                <div class="sent_msg">
                  <p>${data.message}</p>
                  <span class="time_date"> 11:01 AM    |    Today</span> </div>
              </div>
              
            `);
            }

            

            $('#chat').append(messageType);
        })
    }
}