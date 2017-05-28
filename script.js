﻿var latlng="";
var event_state="";
var event_numofguest;
var ifgoing = "going";
var URLParams = "";

document.addEventListener("DOMContentLoaded", function(){
	
	 URLParams = {
		event: findGetParameter("event"),
		guest: findGetParameter("guest")
	};
	
	database.ref('/users/' + URLParams.event + '/Invitations/sent_contacts/'+URLParams.guest).once('value').then(function(snapshot) {
		var event2 = snapshot.val();
		event_state = event2.arrive_state;
		event_numofguest = event2.num_of_guests;
		if(event2.arrive_state == "not_going"){
			not_going_click();
		}else if(event2.arrive_state == "going"){
			going_click();
		}else if (event2.arrive_state == "maybe"){
			maybe_click();
		}if(event_numofguest==0){}else{
			
			var element = document.getElementById('guests');
	    	element.value = event_numofguest;
	    }
			/*
		var htmlData2 = {
			event_arrive_state: event2.arrive_state,
			event_numofguest: event2.num_of_guests,
			
		};*/

		
		database.ref('/users/' + URLParams.event + '/Invitations/Event').once('value').then(function(snapshot) {

			document.querySelector ("form").style.display="block";
			document.querySelector (".lightbox").style.display="none"; 

			var event = snapshot.val();
			
			var htmlData = {
				// eventName: event.name,
				// eventTitle: event.name,
				//eventDetails: event.event_details,
				event_start: event.date + " 18:30:00",
				event_end: event.date + " 24:00:00",
				//event_time: "תאריך החתונה: " + event.date ,
				event_title: event.name,
				event_place: event.place,
			};
			
		
			for(id in htmlData)
				document.getElementById(id).innerHTML = htmlData[id];
		
		    document.getElementById("wazeLink").href = "waze://?ll=" + event.latlng + "&navigate=yes"
	  
			latlng = event.latlng;
			if (window.addtocalendar)if(typeof window.addtocalendar.start == "function")return;
            if (window.ifaddtocalendar == undefined) { window.ifaddtocalendar = 1;
                var d = document, s = d.createElement('script'), g = 'getElementsByTagName';
                s.type = 'text/javascript';s.charset = 'UTF-8';s.async = true;
                s.src = ('https:' == window.location.protocol ? 'https' : 'http')+'://addtocalendar.com/atc/1.5/atc.min.js';
                var h = d[g]('body')[0];h.appendChild(s); };
		});
	
		

		
	
		
	});
	
	
	
	
});




function myNavFunc(){
    // If it's an iPhone..
    if( (navigator.platform.indexOf("iPhone") != -1) 
        || (navigator.platform.indexOf("iPod") != -1)
        || (navigator.platform.indexOf("iPad") != -1))
         window.open("maps://maps.google.com/maps?daddr=" + latlng + "&amp;ll=");
    else
         window.open("http://maps.google.com/maps?daddr=" + latlng + "&amp;ll=");
}

function not_going_click(){
		document.getElementById('maybe').style.opacity = '0';    
    	document.getElementById('going').style.opacity = '0';
    	document.getElementById('not_going').style.opacity = '1';
    	ifgoing = "not_going";
		var element = document.getElementById('guests');
		element.value = "0";
		 element.style.display = 'none';
		 document.querySelector('.submit-bottun').style.top="390px";
		document.querySelector('.main-artboard .footericons').style.top = "455";
}


function going_click(){
		document.getElementById('maybe').style.opacity = '0';    
    	document.getElementById('going').style.opacity = '1';
    	document.getElementById('not_going').style.opacity = '0';
    	ifgoing = "going";
		var element = document.getElementById('guests');
		element.style.display = 'inline-block';
		 document.querySelector('.submit-bottun').style.top="445px";
		document.querySelector('.main-artboard .footericons').style.top = "512";

}
function maybe_click(){

		document.getElementById('maybe').style.opacity = '1';    
    	document.getElementById('going').style.opacity = '0';
    	document.getElementById('not_going').style.opacity = '0';
    	ifgoing = "maybe";
		var element = document.getElementById('guests');
		element.style.display = 'inline-block';
		document.querySelector('.submit-bottun').style.top="445px";
		document.querySelector('.main-artboard .footericons').style.top = "512";
}

function my_submit(){
		database.ref('/users/' + URLParams.event + '/Invitations/sent_contacts/'+URLParams.guest+'/arrive_state').set(ifgoing).then(function(){
			if(ifgoing == "not_going"){
				var strUser = "0";
			}else{
				var e = document.getElementById("guests");
				var strUser = e.options[e.selectedIndex].value;
			}
			
			database.ref('/users/' + URLParams.event + '/Invitations/sent_contacts/'+URLParams.guest+'/num_of_guests').set(strUser).then(function(){
				window.location.href = 'thankyouartboard.html';
			});
		});
}

function findGetParameter(parameterName) {
    var result = null,
        tmp = [];
    location.search
    .substr(1)
        .split("&")
        .forEach(function (item) {
        tmp = item.split("=");
        if (tmp[0] === parameterName) result = decodeURIComponent(tmp[1]);
    });
    return result;
}
