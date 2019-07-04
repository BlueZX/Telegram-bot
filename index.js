const TelegramBot = require('node-telegram-bot-api');
const imageSearch = require('duckduckgo-images-api');

// API Token Telegram
const token = '800475736:AAEwgsyQH0OKfNdELfj-aayxflzdrUKadl4';

const bot = new TelegramBot(token, {polling: true});

bot.on('polling_error', (error) => {
    console.log(error);
});

bot.onText(/^\/help/, msg => {
    bot.sendMessage(msg.chat.id,`Lista de comandos: \n/id este comando te muestra tu ID en el chat o el algún usuario que estes replicando el mensaje \n/chatid este comando te da el ID del chat \n/mod (only admin) dar ADMIN a un user del grupo \n/unmod (only admin) quita el admin a un admin xd \n/ban (only admin) banea a un usuario xdxd \n/img busca una imagen ej: /img jano gay`);
});

bot.onText(/^\/id/, msg => {

    if (msg.reply_to_message === undefined){
        bot.sendMessage(msg.chat.id, `Tu id @${msg.from.username} es ${msg.from.id}`);  

        return;
    }
    
    bot.sendMessage(msg.chat.id,`La ID de @${msg.reply_to_message.from.username} es ${msg.reply_to_message.from.id}`);
   
});

bot.onText(/^\/img (.+)/, async(msg, match) => {
    let text = match[1];
    let images = [];
    for await (let resultSet of imageSearch.image_search_generator({ query: text, moderate: false ,iterations :1})){

        
        resultSet.forEach(element => {
            //console.log(element);
            images.push(element.image);

            //bot.sendPhoto(msg.chat.id,element.image );
        });

      }
    console.log(images);
    if(images.length != 0){
        var rand = images[Math.floor(Math.random() * (images.length - 5) )];
        bot.sendPhoto(msg.chat.id,rand );
    }

});


bot.onText(/^\/chatid/, msg => {

    const chatId = msg.chat.id;

    bot.sendMessage(chatId, "El id del chat es " + chatId);  
});

// Cuando mandes el mensaje "Hola" reconoce tú nombre y genera un input: Hola Daniel
bot.onText(/^\/hola/, msg => {
    bot.sendMessage(msg.chat.id, "Hola  @" + msg.from.username);
});



bot.onText(/^\/mod/, (msg) => {

        let chatId = msg.chat.id;
        let userId = msg.from.id;
        let replyId = msg.reply_to_message.from.id;
        let replyName = msg.reply_to_message.from.username;
        let userName = msg.from.username;
        let messageId = msg.message_id;
    
        const prop = {};
        
        prop.can_delete_message = true;
        prop.can_change_info = false;
        prop.can_invite_users = true;
        prop.can_pin_messages = true;
        prop.can_restrict_members = true;
        prop.can_promote_members = false;
    
        if (msg.reply_to_message === undefined){
            return;
        }
    
        bot.getChatMember(chatId, userId).then(data => {
            if ((data.status === 'creator') || (data.status === 'administrator')){

                bot.promoteChatMember(chatId, replyId, prop).then(result => {

                    bot.deleteMessage(chatId, messageId);
                    bot.sendMessage(chatId, `Ahora @${replyName}, es administrador.`)
                })
            }
            else {
                bot.sendMessage(chatId, `Lo siento @${userName}, no eres administrador` )
            }
        })
    });


    bot.onText(/^\/unmod/, (msg) => {

        let chatId = msg.chat.id;
        let replyName = msg.reply_to_message.from.username;
        let replyId = msg.reply_to_message.from.id;
        let userId = msg.from.id;
        let fromName = msg.from.username;
        let messageId = msg.message_id;
    
        const prop = {};
        
        prop.can_change_info = false;
        prop.can_delete_message = false;
        prop.can_invite_users = false;
        prop.can_pin_messages = false;
        prop.can_restrict_members = false;
        prop.can_promote_members = false;
    
        if (msg.reply_to_message === undefined) {
            return;
        }
    
        bot.getChatMember(chatId, userId).then(data => {

            if ((data.status === 'creator') || (data.status === 'administrator')) {

                bot.promoteChatMember(chatId, replyId, prop).then(result => {

                    bot.deleteMessage(chatId, messageId)
                    bot.sendMessage(chatId, `Ahora @${replyName}, ya no es administrador.`)
                })
            } 
            else {
                bot.sendMessage(chatId, `Lo siento @${userName}, no eres administrador` )
            }
        })
    });

bot.onText(/^\/ban/, (msg) => {

    let chatId = msg.chat.id;
    let userId = msg.from.id;
    let replyId = msg.reply_to_message.from.id;
    let replyName = msg.reply_to_message.from.first_name;
    let fromName = msg.from.first_name;
    let messageId = msg.message_id;

    if (msg.reply_to_message === undefined){
        return;
    }
    
    bot.getChatMember(chatId, userId).then(function(data){
        if((data.status == 'creator') || (data.status == 'administrator')){
        bot.kickChatMember(chatId, replyId, {}).then(function(result){
                bot.deleteMessage(chatId, messageId);
                bot.sendMessage(chatId, "El usuario " + replyName + " ha sido baneado.")
            })
        }
        else {
        bot.sendMessage(chatId, "Lo siento " + fromName + ", no eres administrador")
        }
    })
});

//Comando only private
/*
bot.onText(/^\/ping/, function(msg){
    var chatId = msg.chat.id;
    var tipoChat = msg.chat.type;
    
    if (tipoChat == 'private'){
        bot.sendMessage(chatId, "Pong!")
    } 
    
    else if (tipoChat == 'supergroup') {
        bot.sendMessage(chatId, "Este comando solo funciona en privado")
    }
});
*/