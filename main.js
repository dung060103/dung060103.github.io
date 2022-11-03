console.log('RUNNING main.js');
const socket = io('https://webrtc3000.herokuapp.com/', { transports : ['websocket'] })
var user = new User();
const config = {
    video: true,
    audio: false,
} 
$('.bodyCall').hide();
$('.body-signUp').show();

socket.on('LIST_USER_ONLINE',listUser=>{

    $('#listUserOnline').html('');
    listUser.forEach(user=>{
        $('#listUserOnline').append(`<a href="#" data-id='${user.id_peerJS}' class="list-group-item list-group-item-action list-group-item-success">${user.name}</a>`)
    })
})
socket.on('NEW_USER',user=>{
    $('.bodyCall').show();
    $('.body-signUp').hide();
        $('#listUserOnline').append(`<a href="#" class="list-group-item list-group-item-action list-group-item-success">${user.name}</a>`)
})

function openStream(){
    if(navigator.mediaDevices &&  navigator.mediaDevices.getUserMedia){
        return navigator.mediaDevices.getUserMedia(config)
    }
    return null;
}
var localCallVideo = document.querySelector('#localCallVideo');
var localGuestVideo = document.querySelector('#localGuestVideo');


function playStream(video,stream)
{
    console.log(video,stream);
        // const mediaRecoder = new type(arguments);
        // var video = document.createElement('video');
        // video.width=10;
        // video.height=10;
        // video.autoplay=true;
        video.srcObject=stream;
        // document.body.appendChild(video);
        // video.play();
}
const peerJS = new Peer();
var conn = peerJS.connect('another-peers-id');
peerJS.on('open',function(id){
    $('#ID_PEERJS').text(`Your ID: ${id}`)
    user.id_peerJS=id;
})
$('#callNow').click(()=>{
    // var id=$('#value_ID_PEERJS').val();
    var id=document.querySelector('#value_ID_PEERJS').value;
    console.log(id);
    openStream().then(stream=>{
        playStream(localCallVideo,stream);
        // playStream(localGuestVideo,stream);

        
        var call = peerJS.call(id,stream);
        call.on('stream', remoteStream=>{
            // console.log(remoteStream);
            playStream(localGuestVideo,remoteStream)
        }, function(err) {
            console.log('Failed to get local stream' ,err);
          })
    })
})
peerJS.on('call',call=>{
    openStream().then(stream=>{
        call.answer(stream);
        playStream(localCallVideo,stream);
        // playStream(null,stream);
        call.on('stream', remoteStream=>{
            // console.log(remoteStream);
            playStream(localGuestVideo,remoteStream);
        }, function(err) {
            console.log('Failed to get local stream' ,err);
          })
    })
})
$('#btnSignUpUserName').click(()=>{
    var value_iptSignUpUserName = $('#iptSignUpUserName').val();
    user.name=value_iptSignUpUserName

    socket.emit('SIGN_UP_USER_NAME', user)
    $('.bodyCall').show();
    $('.body-signUp').hide();
    // console.log(iptSignUpUserName);
})

$('#listUserOnline').on('click','a',function(){
    const id = ($(this).attr('data-id'));
    openStream().then(stream=>{
        playStream(localCallVideo,stream);
        // playStream(localGuestVideo,stream);
        var call = peerJS.call(id,stream);
        call.on('stream', remoteStream=>{
            // console.log(remoteStream);
            playStream(localGuestVideo,remoteStream)
        }, function(err) {
            console.log('Failed to get local stream' ,err);
          })
    })
})
function User({
name=''
,id_peerJS=''
,
}={})
{
    this.name=name;
this.id_peerJS=id_peerJS;
}