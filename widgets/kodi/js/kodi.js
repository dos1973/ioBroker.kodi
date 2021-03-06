/*
    kodi Widget-Set
    Copyright 10.2015-2016 instalator<vvvalt@mail.ru>
*/
"use strict";

if (vis.editMode){
    $.extend(true, systemDictionary, {
        "myColor":         {"en": "myColor", "de": "mainColor", "ru": "Мой цвет"},
        "myColor_tooltip": {
            "en": "Description of\x0AmyColor",
            "de": "Beschreibung von\x0AmyColor",
            "ru": "Описание\x0AmyColor"
        },
        "oid_playlist":    {"en": "playlist", "de": "playlist", "ru": "playlist"},
        "oid_pvrplaylist": {"en": "PVR playlist", "de": "PVR playlist", "ru": "PVR playlist"},
        "oid_position":    {"en": "position", "de": "position", "ru": "position"},
        "oid_codec":       {"en": "audio codec", "de": "audio codec", "ru": "audio codec"},
        "oid_aspect":      {"en": "video aspect", "de": "video_aspect", "ru": "video_aspect"},
        "oid_channel":     {"en": "channels", "de": "channels", "ru": "channels"},
        "oid_videocodec":  {"en": "video codec", "de": "video_codec", "ru": "video_codec"},
        "oid_play":        {"en": "play", "de": "play", "ru": "play"},
        "oid_speed":       {"en": "speed", "de": "speed", "ru": "speed"},
        "oid_prev":        {"en": "previous", "de": "previous", "ru": "previous"},
        "oid_next":        {"en": "next", "de": "next", "ru": "next"},
        "oid_stop":        {"en": "stop", "de": "stop", "ru": "stop"},
        "oid_mute":        {"en": "mute", "de": "mute", "ru": "mute"},
        "oid_rpt":         {"en": "repeat", "de": "repeat", "ru": "repeat"},
        "oid_shf":         {"en": "shuffle", "de": "shuffle", "ru": "shuffle"},
        "oid_seek":        {"en": "seek", "de": "seek", "ru": "seek"},
        "oid_server":      {
            "en": "IP adress and port of Kodi system. Example: 127.0.0.1:8080",
            "de": "IP Adresse und Port des Kodi Systems. Beispiel: 127.0.0.1:8080",
            "ru": "IP адрес и порт веб сервера коди. Например: 127.0.0.1:8080"
        },
        "oid_resolut":     {"en": "video_height", "de": "video_height", "ru": "video_height"}
    });
}

$.extend(true, systemDictionary, {
    "Instance": {"en": "Instance", "de": "Instanz", "ru": "Инстанция"}
});

vis.binds.kodi = {
    version:     "2.0.0",
    showVersion: function (){
        if (vis.binds.kodi.version){
            console.log('Version kodi: ' + vis.binds.kodi.version);
            vis.binds.kodi.version = null;
        }
    },
    states:      {
        oid_seek:         	{val: 0, 			role: 'media.seek', 		kodi: true, selector: '', objName: 'oid_seek'},
        oid_curtimetotal: 	{val: undefined, 	role: 'button.play', 		kodi: true, selector: '', objName: 'curtimetotal'},
		oid_playlist:   	{val: '',        	role: 'media.playlist',     kodi: true},
		oid_position:       {val: '',        	role: 'media.track',        kodi: true},
		oid_thumbnail:      {val: '',        	role: 'media.thumbnail',    kodi: true},
		oid_type:      		{val: '',        	role: 'media.type',      	kodi: true},
		oid_play:       	{val: undefined,	role: 'button.play',        kodi: true},
		oid_speed:       	{val: undefined,	role: 'media.speed',        kodi: true},
		oid_next:       	{val: undefined,	role: 'button.next',        kodi: true},
		oid_prev:       	{val: undefined,	role: 'button.prev',        kodi: true},
		oid_stop:       	{val: undefined,	role: 'button.stop',        kodi: true},
		oid_pause:      	{val: undefined,	role: 'button.pause',       kodi: true},
		oid_mute:      		{val: undefined,	role: 'media.mute',       	kodi: true},
		oid_rpt:      		{val: undefined,	role: 'media.mode.repeat',  kodi: true},
		oid_shf:      		{val: undefined,	role: 'media.mode.shuffle', kodi: true},
        oid_server:       	{val: undefined,	role: 'media.webserver',    kodi: true},
    },
    /***********************************************************************/
    Thumbnail:   function (widgetID, view, data, style){
        var $div = $('#' + widgetID);
        var type = null;
        // if nothing found => wait
        if (!$div.length){
            return setTimeout(function (){
                vis.binds.kodi.Thumbnail(widgetID, view, data, style);
            }, 100);
        }

        function Thumb(cover){
            var url_thumb;
            if (vis.editMode){
                $div.find('li').removeClass().addClass("cover adef").css('backgroundImage', 'url()');
            } else {
                if (cover && cover !== 'image://DefaultAlbumCover.png/'){
                    url_thumb = 'http://' + data.oid_server + '/image/' + encodeURI(cover);
                    $div.find('li').removeClass().addClass("cover").css('backgroundImage', 'url(' + url_thumb + ')');
                } else {
                    if (type == 'video'){
                        $div.find('li').removeClass().addClass("cover vdef").css('backgroundImage', 'url()');
                    } else {
                        $div.find('li').removeClass().addClass("cover adef").css('backgroundImage', 'url()');
                    }
                }
            }
        }

        // subscribe on updates of value
        if (data.oid_thumbnail){
            vis.states.bind(data.oid_thumbnail + '.val', function (e, newVal, oldVal){
                Thumb(newVal);
            });
        }
        if (data.oid_type){
            vis.states.bind(data.oid_type + '.val', function (e, newVal, oldVal){
                type = newVal;
                Thumb();
            });
        }
        Thumb(vis.states[data.oid_thumbnail + '.val']);
    },
    /************************************************************************/
    Progress:    function (widgetID, view, data, style){
        var $div = $('#' + widgetID);

        if (!$div.length){
            return setTimeout(function (){
                vis.binds.kodi.Progress(widgetID, view, data, style);
            }, 100);
        }

        $(function (){
            $div.progressbar({
                value: 0
            });
        });

        $div.on('click', function (e){
            var maxWidth = $(this).css("width").slice(0, -2);
            //var left = $(this).css("left").slice(0, -2);
            var clickPos = e.pageX - this.offsetLeft;
            var percentage = clickPos / maxWidth * 100;
            vis.setValue(data.oid_seek, percentage);
            $div.progressbar("option", "value", percentage);
        });

        // subscribe on updates of value
        if (data.oid_seek){
            vis.states.bind(data.oid_seek + '.val', function (e, newVal, oldVal){
                $div.progressbar("value", newVal);
            });
        }
    },
    /**************************************************************************/
    Button:      function (widgetID, view, data, style){
        var $div = $('#' + widgetID);

        if (!$div.length){
            return setTimeout(function (){
                vis.binds.kodi.Button(widgetID, view, data, style);
            }, 100);
        }

        $("#kodicontrols .prev").on('click', function (){
            vis.setValue(data.oid_prev, '');
        });
        $("#kodicontrols .rewind").on('click', function (){
            var seek = vis.states[data.oid_seek + '.val'];
            vis.setValue(data.oid_speed, 'decrement');
        });
        $("#kodicontrols .playpause").on('click', function (){
            var speed = vis.states[data.oid_speed + '.val'];
            if (speed === 1){
                vis.setValue(data.oid_speed, 0);
            } else {
                vis.setValue(data.oid_speed, 1);
            }
        });
        $("#kodicontrols .stop").on('click', function (){
            vis.setValue(data.oid_stop, '');
        });
        $("#kodicontrols .forward").on('click', function (){
            var seek = vis.states[data.oid_seek + '.val'];
            vis.setValue(data.oid_speed, 'increment');
        });
        $("#kodicontrols .next").on('click', function (){
            vis.setValue(data.oid_next, '');
        });
        $("#kodicontrols .repeat").on('click', function (){
            var rpt = vis.states[data.oid_rpt + '.val'];
            if (rpt === 'off'){
                vis.setValue(data.oid_rpt, 'one');
            } else if (rpt === 'one'){
                vis.setValue(data.oid_rpt, 'all');
            } else if (rpt === 'all'){
                vis.setValue(data.oid_rpt, 'off');
            }
        });
        $("#kodicontrols .shuffle").on('click', function (){
            var shf = vis.states[data.oid_shf + '.val'];
            if (shf === false){
                vis.setValue(data.oid_shf, true);
            } else {
                vis.setValue(data.oid_shf, false);
            }
        });
		
        // subscribe on updates of value
        if (data.oid_speed){
            vis.states.bind(data.oid_speed + '.val', function (e, newVal, oldVal){
                var sp = $("#kodicontrols > .playpause");
                if (newVal !== 1){
                    sp.removeClass().addClass('playpause play');
                } else {
                    sp.removeClass().addClass('playpause');
                }
            });
        }
        if (data.oid_rpt){
            vis.states.bind(data.oid_rpt + '.val', function (e, newVal, oldVal){
                var r = $("#kodicontrols > .repeat");
                if (newVal === 'off'){
                    r.removeClass();
                    r.addClass("repeat off");
                } else if (newVal === 'one'){
                    r.removeClass();
                    r.addClass("repeat one");
                } else if (newVal === 'all'){
                    r.removeClass();
                    r.addClass("repeat all");
                }
            });
        }
        if (data.oid_shf){
            vis.states.bind(data.oid_shf + '.val', function (e, newVal, oldVal){
                var s = $("#kodicontrols > .shuffle");
				if (newVal){
					s.removeClass('off').addClass('on');
				} else {
					s.removeClass('on').addClass('off');
				}
            });
        }
    },
    /**************************************************************************/
    Playlist:    function (widgetID, view, data, style){
        var $div = $('#' + widgetID);
        // if nothing found => wait
        if (!$div.length){
            return setTimeout(function (){
                vis.binds.kodi.Playlist(widgetID, view, data, style);
            }, 100);
        }
        var playlist;

        function SetPlaylist(val){
            playlist = JSON.parse(val);
            var _playlist = {};
            if (playlist){
                _playlist = playlist;
                $div.find("#playListContainer").empty();
                _playlist.forEach(function (item, i, arr){
					let file = _playlist[i].file.split('/');
					file = file[file.length - 1]; 
					let label = _playlist[i].label ? _playlist[i].label : file;
                    $div.find("#playListContainer").append("<li class='item" + (i + 1) + "'>" + (i + 1) + ' - ' + label + "</li>");
                });
                $div.find("#playListContainer .item" + (parseInt(vis.states[data.oid_position + '.val']) + 1)).addClass("active");
                $div.find('#playListContainer').on('click', "li", function (){
                    var n = $(this).index();
                    vis.setValue(data.oid_position, n);
                });
            } else if (playlist.channels){
                _playlist = playlist.channels;
                $div.find("#playListContainer").empty();
                _playlist.forEach(function (item, i, arr){
                    var url = 'http://' + data.oid_server + '/image/' + encodeURI(_playlist[i].thumbnail);
                    $div.find("#playListContainer").append("<li class='item" + (i + 1) + "'><img src='" + url + "' style='width: 50px; height: 50px; vertical-align: middle; margin: 2px;'> " + _playlist[i].label + "</li>");
                });
                $div.find("#playListContainer .item" + (parseInt(vis.states[data.oid_position + '.val']) + 1)).addClass("active");

                $div.find('#playListContainer').on('click', "li", function (){
                    var n = $(this).index() + 1;
                    vis.setValue(data.oid_position, n);
                });
            }
        }

        // subscribe on updates of value
		var bound = [];
        if (data.oid_playlist){
			bound.push(data.oid_playlist + '.val');
			vis.states.bind(data.oid_playlist + '.val', SetPlaylist);
        }
        if (data.oid_position){
            vis.states.bind(data.oid_position + '.val', function (e, newVal, oldVal){
                $div.find("#playListContainer li").removeClass("active");
                newVal = parseInt(newVal);
                //if (playlist.items){
                    newVal++;
               //}
                $div.find("#playListContainer .item" + newVal).addClass("active");
            });
        }
        if ($div.length){
            SetPlaylist(vis.states[data.oid_playlist + '.val']);
        }
        
		if (bound.length) {
			$div.data('bound', bound);
		}
    },
    /************************************************************************/
    CodecInfo:   function (widgetID, view, data, style){
        var $div = $('#' + widgetID);
        // if nothing found => wait
        if (!$div.length){
            return setTimeout(function (){
                vis.binds.kodi.CodecInfo(widgetID, view, data, style);
            }, 100);
        }

        function SetCodecInfo(val){
            if (val){
                $('.kodiinfo > .codec').css('backgroundImage', 'url(./widgets/kodi/img/audio/' + val + '.png)');
            }
        }

        // subscribe on updates of value
        if (data.oid_codec){
            vis.states.bind(data.oid_codec + '.val', function (e, newVal, oldVal){
                SetCodecInfo(newVal);
            });
        }
        if (vis.editMode){
            SetCodecInfo('dtshd_ma');
        } else {
            SetCodecInfo(vis.states[data.oid_codec + '.val']);
        }
    },
    /************************************************************************/
    AspectInfo:  function (widgetID, view, data, style){
        var $div = $('#' + widgetID);
        // if nothing found => wait
        if (!$div.length){
            return setTimeout(function (){
                vis.binds.kodi.AspectInfo(widgetID, view, data, style);
            }, 100);
        }

        function SetAspectInfo(val){
            if (val){
                val = parseFloat(val).toFixed(2);
                $('.kodiinfo > .aspect').css('backgroundImage', 'url(./widgets/kodi/img/aspectratio/' + val + '.png)');
            }
        }

        // subscribe on updates of value
        if (data.oid_aspect){
            vis.states.bind(data.oid_aspect + '.val', function (e, newVal, oldVal){
                SetAspectInfo(newVal);
            });
        }
        if (vis.editMode){
            SetAspectInfo('1.78');
        } else {
            SetAspectInfo(vis.states[data.oid_aspect + '.val']);
        }
    },
    /************************************************************************/
    ResolutInfo: function (widgetID, view, data, style){
        var $div = $('#' + widgetID);
        // if nothing found => wait
        if (!$div.length){
            return setTimeout(function (){
                vis.binds.kodi.ResolutInfo(widgetID, view, data, style);
            }, 100);
        }

        function SetResolutInfo(val){
            if (val){
                $('.kodiinfo > .resolut').css('backgroundImage', 'url(./widgets/kodi/img/video/' + val + '.png)');
            }
        }

        // subscribe on updates of value
        if (data.oid_resolut){
            vis.states.bind(data.oid_resolut + '.val', function (e, newVal, oldVal){
                SetResolutInfo(newVal);
            });
        }
        if (vis.editMode){
            SetResolutInfo('1080');
        } else {
            SetResolutInfo(vis.states[data.oid_resolut + '.val']);
        }

    },
    /************************************************************************/
    ChannelInfo: function (widgetID, view, data, style){
        var $div = $('#' + widgetID);
        // if nothing found => wait
        if (!$div.length){
            return setTimeout(function (){
                vis.binds.kodi.ChannelInfo(widgetID, view, data, style);
            }, 100);
        }

        function SetChannelInfo(val){
            if (val){
                $('.kodiinfo > .channel').css('backgroundImage', 'url(./widgets/kodi/img/audio/' + val + '.png)');
            }
        }

        // subscribe on updates of value
        if (data.oid_channel){
            vis.states.bind(data.oid_channel + '.val', function (e, newVal, oldVal){
                SetChannelInfo(newVal);
            });
        }
        if (vis.editMode){
            SetChannelInfo('6');
        } else {
            SetChannelInfo(vis.states[data.oid_channel + '.val']);
        }
    },
    /************************************************************************/
    VideoCodec:  function (widgetID, view, data, style){
        var $div = $('#' + widgetID);
        // if nothing found => wait
        if (!$div.length){
            return setTimeout(function (){
                vis.binds.kodi.VideoCodec(widgetID, view, data, style);
            }, 100);
        }

        function SetVideoCodecInfo(val){
            if (val){
                $('.kodiinfo > .videocodec').css('backgroundImage', 'url(./widgets/kodi/img/video/' + val + '.png)');
            }
        }

        // subscribe on updates of value
        if (data.oid_videocodec){
            vis.states.bind(data.oid_videocodec + '.val', function (e, newVal, oldVal){
                SetVideoCodecInfo(newVal);
            });
        }
        if (vis.editMode){
            SetVideoCodecInfo('vhs');
        } else {
            SetVideoCodecInfo(vis.states[data.oid_videocodec + '.val']);
        }
    }
    /***********************************************************************/

};

if (vis.editMode) {
	vis.binds.kodi.onCommonChanged = function (widgetID, view, newId, attr, isCss, oldValue, type) {
		if (oldValue && oldValue !== 'nothing_selected') return;
		console.log('---------: ' + widgetID +' - ' + view + ' - ' + newId + ' - ' + attr + ' - ' + isCss);

		var changed = [];
		var obj = vis.objects[newId];

		// If it is real object and SETPOINT
		if (obj && obj.common && obj.type === 'state') {
			var roles = [];
			var s;
			for (s in vis.binds.kodi.states) {
				if (!vis.binds.kodi.states.hasOwnProperty(s) || !vis.binds.kodi.states[s][type]) continue;
				if (vis.views[view].widgets[widgetID].data[s]) continue;

				roles.push(vis.binds.kodi.states[s].role);
			}

			if (roles.length) {
				var result = vis.findByRoles(newId, roles);
				if (result) {
					var name;
					for (var r in result) {
						if (!result.hasOwnProperty(r)) continue;

						name = null;
						for (s in vis.binds.kodi.states) {
							if (!vis.binds.kodi.states.hasOwnProperty(s)) continue;

							if (vis.binds.kodi.states[s].role === r) {
								changed.push(s);
								vis.views[view].widgets[widgetID].data[s] = result[r];
								vis.widgets[widgetID].data[s] = result[r];
								break;
							}
						}
					}
				}
			}
		}
		return changed;
	};

	vis.binds.kodi.onPlaylistBrowserChanged = function (widgetID, view, newId, attr, isCss, oldValue) {
		return vis.binds.kodi.onCommonChanged(widgetID, view, newId, attr, isCss, oldValue, 'kodi');
	};
	vis.binds.kodi.onThumbnailBrowserChanged = function (widgetID, view, newId, attr, isCss, oldValue) {
		return vis.binds.kodi.onCommonChanged(widgetID, view, newId, attr, isCss, oldValue, 'kodi');
	};
	vis.binds.kodi.onKodiButtonBrowserChanged = function (widgetID, view, newId, attr, isCss, oldValue) {
		return vis.binds.kodi.onCommonChanged(widgetID, view, newId, attr, isCss, oldValue, 'kodi');
	};
}	
vis.binds.kodi.showVersion();
