const TelegramBot = require('node-telegram-bot-api');
const imageSearch = require('duckduckgo-images-api');

const fs = require('fs');
const ytdl = require('ytdl-core');

// API Token Telegram
const token = '800475736:AAEwgsyQH0OKfNdELfj-aayxflzdrUKadl4';

const bot = new TelegramBot(token, {polling: true});

bot.on('polling_error', (error) => {
    console.log(error);
});

bot.onText(/^\/help/, msg => {
    bot.sendMessage(msg.chat.id,`Lista de comandos: \n/id muestra tu ID en el chat o el algún usuario que estes replicando el mensaje \n/chatid este comando te da el ID del chat \n/img busca una imagen ej: /img color azul\n/yt para descargar videos o audio de yutu ej: /yt https://www.youtube.com/H?=DSHRYSNSJ \n/mod (only admin) dar ADMIN a un user del grupo \n/unmod (only admin) quita el admin a un admin \n/ban (only admin) banea a un usuario`);
});

bot.onText(/^\!id/, msg => {

    if (msg.reply_to_message === undefined){

        if(msg.from.username === undefined){
            bot.sendMessage(msg.chat.id, `Tu id ${msg.from.first_name} es ${msg.from.id}`);  
            return;    
        }else{
            bot.sendMessage(msg.chat.id, `Tu id @${msg.from.username} es ${msg.from.id}`);  
            return;
        }
    }

    if(msg.reply_to_message.from.username === undefined){
        bot.sendMessage(msg.chat.id,`La ID de ${msg.reply_to_message.from.first_name} es ${msg.reply_to_message.from.id}`);
    }else{
        bot.sendMessage(msg.chat.id,`La ID de @${msg.reply_to_message.from.username} es ${msg.reply_to_message.from.id}`);
    }   
});

bot.onText(/^\/paro/, msg => {

    bot.sendVideo(msg.chat.id,"archivos/paro.mp4");
});

bot.onText(/^\/img (.+)/, async(msg, match) => {
    let text = match[1];
    let images = [];

    let a = Math.floor(Math.random() * 10);
    
    for await (let resultSet of imageSearch.image_search_generator({ query: text, moderate: false ,iterations :1})){

        
        resultSet.forEach(element => {
            // console.log(element);
            images.push(element.image);
            return;

            //bot.sendPhoto(msg.chat.id,element.image );
        });

      }
    // console.log(images);
    if(images.length >= a){
        var rand = images[a];
        bot.sendPhoto(msg.chat.id,rand );
    }
    else if(images.length > 0){
        var rand = images[0];
        bot.sendPhoto(msg.chat.id,rand );
    }
    else{
        bot.sendMessage(msg.chat.id,"Imagen no encontrada");
    }

});


bot.onText(/^\/chatid/, msg => {

    const chatId = msg.chat.id;

    bot.sendMessage(chatId, "El id del chat es " + chatId);  
});

// Cuando mandes el mensaje "Hola" reconoce tú nombre y genera un input: Hola Daniel
bot.onText(/^\/hola/, msg => {

    if(msg.from.username === undefined){
        bot.sendMessage(msg.chat.id, "Hola " + msg.from.first_name);
        return;
    }
    bot.sendMessage(msg.chat.id, "Hola @" + msg.from.username);
});

bot.onText(/^\/yt (.+)/, async(msg, match) => {

    let url = match[1];
    
    if(ytdl.validateURL(url)){
        let datos = await ytdl.getInfo(url);  
        let title = datos.videoDetails.title.replace(/[^a-zA-Z 0-9.]+/g,'');
        let name = title.replace(/ /g,'_') + '.mp4';
        //let name = ytdl.getVideoID(url) + '.mp4';

        const options = {
            reply_markup: {
                inline_keyboard: [
                    [
                        {text:'✅ 720p (.mp4)', callback_data: 'mp4_720'},
                        {text:'✅ 480p (.mp4)', callback_data: 'mp4_480'}
                    
                    ],
                    [
                        {text:'✅ 360p (.mp4)', callback_data: 'mp4_360'},
                        {text:'✅ .mp3 (128kbps)', callback_data: 'mp3_128'}
                    ]
                ]
            }
        };

        bot.sendMessage(msg.chat.id,'Seleccione un formato para el video', options);

        bot.on('callback_query', (action) => {
            const data = action.data;
            const msg = action.message;

            // console.log(action);

            switch(data){
                case 'mp4_720':
                    bot.editMessageText("🕑 descargando el video ...",{
                        chat_id:msg.chat.id,
                        message_id:msg.message_id
                    })
                    .then(() => {
                        ytdl(url, {format: 'mp4', quality: 136})
                            .pipe(fs.createWriteStream('archivos/'+ name).on('finish', () => {
                                bot.editMessageText("🕔 Enviando el video ...",{
                                    chat_id:msg.chat.id,
                                    message_id:msg.message_id
                                }).then(() => {
                                    bot.sendVideo(msg.chat.id, 'archivos/'+ name).then(() => {
                                        bot.deleteMessage(msg.chat.id, msg.message_id);
                                        fs.unlink('archivos/'+ name, () => { });
                                    });
    
                                });
    
                            }))

                    });

                
                    break;
                case 'mp4_480':
                    bot.editMessageText("🕑 descargando el video ...",{
                        chat_id:msg.chat.id,
                        message_id:msg.message_id
                    })
                    .then(() => {
                        ytdl(url, {format: 'mp4', quality: 135 })
                            .pipe(fs.createWriteStream('archivos/'+ name).on('finish', () => {
                                bot.editMessageText("🕔 Enviando el video ...",{
                                    chat_id:msg.chat.id,
                                    message_id:msg.message_id
                                }).then(() => {
                                    bot.sendVideo(msg.chat.id, 'archivos/'+ name).then(() => {
                                        bot.deleteMessage(msg.chat.id, msg.message_id);
                                        fs.unlink('archivos/'+ name, () => { });
                                    });
    
                                });
    
                            }))

                    });

                
                    break;
                case 'mp4_360':
                    bot.editMessageText("🕑 descargando el video ...",{
                        chat_id:msg.chat.id,
                        message_id:msg.message_id
                    })
                    .then(() => {
                        ytdl(url, {format: 'mp4', quality: 134 })
                            .pipe(fs.createWriteStream('archivos/'+ name).on('finish', () => {
                                bot.editMessageText("🕔 Enviando el video ...",{
                                    chat_id:msg.chat.id,
                                    message_id:msg.message_id
                                }).then(() => {
                                    bot.sendVideo(msg.chat.id, 'archivos/'+ name).then(() => {
                                        bot.deleteMessage(msg.chat.id, msg.message_id);
                                        fs.unlink('archivos/'+ name, () => { });
                                    });
    
                                });
    
                            }))

                    });

                
                    break;
                case 'mp3_128':
                    name =  title.replace(/ /g,'_');
                    //name =  ytdl.getVideoID(url)+"";

                    bot.editMessageText("🕑 descargando el audio ...",{
                        chat_id:msg.chat.id,
                        message_id:msg.message_id
                    })
                    .then(() => {
                        ytdl(url, {quality: "highestaudio", filter: "audioonly" })
                            .pipe(fs.createWriteStream('archivos/'+ name + '.mp3').on('finish', () => {
                                // bot.sendMessage(msg.chat.id,'transformando el audio ...');
                                bot.editMessageText("🕔 Enviando el audio ...",{
                                    chat_id:msg.chat.id,
                                    message_id:msg.message_id
                                }).then(() => {
                                    bot.sendAudio(msg.chat.id, 'archivos/'+ name + '.mp3').then(() => {
                                        bot.deleteMessage(msg.chat.id, msg.message_id);
                                        // fs.unlink('archivos/'+ name + '.aac', () => { });
                                        fs.unlink('archivos/'+ name + '.mp3', () => { });
                                    });
    
                                });
    
    
                            }))

                    });

                
                    break;
                default:
                    bot.editMessageText("🕑 descargando el video ...",{
                        chat_id:msg.chat.id,
                        message_id:msg.message_id
                    })
                    .then(() => {
                        ytdl(url, {format: 'mp4'})
                            .pipe(fs.createWriteStream('archivos/'+ name).on('finish', () => {
                                bot.editMessageText("🕔 Enviando el video ...",{
                                    chat_id:msg.chat.id,
                                    message_id:msg.message_id
                                }).then(() => {
                                    bot.sendVideo(msg.chat.id, 'archivos/'+ name).then(() => {
                                        bot.deleteMessage(msg.chat.id, msg.message_id);
                                        fs.unlink('archivos/'+ name, () => { });
                                    });
    
                                });
    
                            }))

                    });

                    break;
            }

            return;
        });

    }
    else{
        bot.sendMessage(msg.chat.id,'El video no se encontro');
    }

    return;

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

//qr comando
bot.onText(/^\/qr/, msg => {
    let data = msg.text.substring(3).trim();
    let imageqr = "https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=" + data;
    bot.sendMessage(msg.chat.id, "[✏️](" + imageqr + ")Qr code de: " + data,{parse_mode : "Markdown"});
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