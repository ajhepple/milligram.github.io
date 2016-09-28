;(function() {

	'use strict';

	var i,
		$description 		= document.querySelector('.description'),
		$download 		= document.querySelector('.download'),
		$popoverLinks 	= document.querySelectorAll('[data-popover]'),
		$popovers			= document.querySelectorAll('.popover'),
		$codeSnippets 	= document.querySelectorAll('.code-content'),
		$shareButtons 	= document.querySelectorAll('.share-dialog'),
		$anchors			= document.querySelectorAll('a'),
		request 			= new XMLHttpRequest(),
		entityMapObject 	= { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': '&quot;', "'": '&#39;', "/": '&#x2F;' },
		teste = window.location.hostname === 'localhost';

	function init() {
		for (i = 0; i < $popoverLinks.length; i++) $popoverLinks[i].addEventListener('click', openPopover);
		document.addEventListener('click', closePopover);
		buildSnippets();
		getVersion();
		googleAnalytics();
		shareDialog();
		localhost();
		// rwdAnalytics();
	}

	function closePopover(event) {
		for (i = 0; i < $popovers.length; i++) $popovers[i].classList.remove('popover-open');
	}

	function openPopover(event) {
		event.preventDefault();
		if (document.querySelector(this.getAttribute('href')).classList.contains('popover-open')) {
			document.querySelector(this.getAttribute('href')).classList.remove('popover-open');
		}
		else {
			closePopover();
			document.querySelector(this.getAttribute('href')).classList.add('popover-open');
		}
		event.stopImmediatePropagation();
	}

	function escapeHtml(string) {
		return String(string).replace(/[&<>"'\/]/g, function(s) {
			return entityMapObject[s];
		});
	}

	function buildSnippets() {
		for (i = 0; i < $codeSnippets.length; i++) $codeSnippets[i].innerHTML = escapeHtml($codeSnippets[i].innerHTML);
	}

	function getVersion() {
		if ($description || $download) {
			request.open('GET', '//raw.githubusercontent.com/milligram/milligram/master/package.json', true);
			request.onload = function() {
				if (this.status >= 200 && this.status < 400) {
					var version = JSON.parse( this.response ).version;
					if ($description) $description.innerHTML = $description.innerHTML+' <br><i><small>Currently v'+version+'</small></i>';
					$download.setAttribute('href', 'https://github.com/milligram/milligram/archive/v'+version+'.zip');
				}
				else {
					console.log('There was a connection error of some sort');
				}
			};
			request.send();
		}
	}

	function googleAnalytics() {
		if (!teste) {
			(function(i, s, o, g, r, a, m) {
				i['GoogleAnalyticsObject'] = r;
				i[r] = i[r] || function() {
					(i[r].q = i[r].q || []).push(arguments);
				},
				i[r].l = 1 * new Date();
				a = s.createElement(o), m = s.getElementsByTagName(o)[0];
				a.async = 1;
				a.src = g;
				m.parentNode.insertBefore(a, m);
			})(window,document,'script','//www.google-analytics.com/analytics.js','ga');
			ga('create', 'UA-24389952-15', 'auto');
			ga('send', 'pageview');
		}
	}

	function shareDialog() {
		if ($shareButtons && window.innerWidth > 1200) {
			for (i = 0; i < $shareButtons.length; i++) {
				$shareButtons[i].addEventListener('click', function(e) {
					e.preventDefault();
					window.open(this.href, 'Share Dialog', 'menubar=no,toolbar=no,resizable=yes,scrollbars=yes,width=650,height=450,top='+(screen.height/2-450/2)+',left='+(screen.width/2-650/2));
				});
			}
		}
	}

	function localhost() {
		if (teste) {
			for (i = 0; i < $anchors.length; i++) $anchors[i].href = $anchors[i].href.replace('https://milligram.github.io', 'http://localhost:3000');
		}
	}

	// function rwdAnalytics() {
	// 	if (!teste) {
	// 	firebase.initializeApp({
	// 		apiKey: 'AIzaSyAT5nFMDrKbyNl6HMk3utp55ajhjh7r7II',
	// 		authDomain: 'rwd-milligram.firebaseapp.com',
	// 		databaseURL: 'https://rwd-milligram.firebaseio.com',
	// 		storageBucket: ''
	// 	});
	// 	}
	// }

	init();

}());