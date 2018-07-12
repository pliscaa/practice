$('#load').on('click', loadFriends);

function loadFriends() {
    var first = document.getElementById('str1').value;
    var second = document.getElementById('str2').value;
    if (checkID(first) && checkID(second)) {
        sendRequest('users.get', {user_ids: first, fields: 'photo_200', v: 5.52}, function (data) {
            users(data.response, 'first');
        });
        sendRequest('users.get', {user_ids: second, fields: 'photo_200', v: 5.52}, function (data) {
            users(data.response, 'second');
        });
        sendRequest('friends.getMutual', {source_uid: first, target_uid: second, v: 5.52}, function (data) {
            searchFriends(data.response);
        });
    }else {
        $('#first_user').empty();
        $('#second_user').empty();
        var html = '<h3>Ой, кажется Вы ввели что-то еще помимо цифр.<br> Попробуйте еще раз.</br></h3>';
        $('ul').html(html);
    }
}

function getUrl(method, params){
    if(!method) throw new Error('Не указан метод!')
    params = params || {};
    params['access_token'] = 'ee0f8ba46264d2b778fc8ec78e91b9c9a0df060f84bfbb0b1aef416dd2658c5c0017d3a6711b7e6c3d5e1';
    return 'https://api.vk.com/method/' + method + '?' + $.param(params);
}

function sendRequest(method, params, func){
    $.ajax({
        url: getUrl(method, params),
        method: 'GET',
        dataType: 'JSONP',
        success: func
    });
}



function users(user, number) {
    var html1 = '';
    var f = user[0];
    html1 += '<a target="_blank" href="https://vk.com/id'+ f.id +'">'
        +'<img src="'+f.photo_200+'" />'
        + '<div>'
        +'<h4>' + f.first_name + ' ' + f.last_name + '</h4>'
        +'</div>'
        +'</a>';
    var key = '#'+ number + '_user';
    $(key).html(html1);
}

function checkID(s){
    if(/[^[0-9]/.test(s)) {
        return false;
    } else{
        return true;
    };
}

function searchFriends(idFriends) {
    console.log(idFriends);
    if(idFriends.length == 0){
        var html = '<h3>Увы, общих друзей нет((</h3>';
        $('ul').html(html);
    }else {
        sendRequest('users.get', {user_ids: idFriends, fields: 'photo_200, online', v: 5.52}, function (data) {
            console.log(data);
            mutualFriends(data.response);
        });
    }
}

function mutualFriends(friends) {
    var html = '<ol><h3>Всего было найдено '+ friends.length + ' друзей/друга: </h3><br> </br>';
    for(var i = 0; i < friends.length; i++){
        var f = friends[i];
        var online = f.online ? 'Online' : 'Offline'; //hhgvu
        html +=
            '<li>'+
            '<a target="_blank" href="https://vk.com/id'+ f.id +'">'
            +'<img src="'+f.photo_200+'" />'
            + '<div>'
            +'<h4>' + f.first_name + ' ' + f.last_name + '</h4>'
            +'<p>'+ online +'</p>'
            +'</div>'
            +'</a>'
            +'</li>';
    }
    html += '</ol>';
    $('ul').html(html);
}





