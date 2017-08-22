document.addEventListener("DOMContentLoaded", function() {
    function createNode(element) {
        return document.createElement(element); // Create the type of element you pass in the parameters
    }

    function append(parent, el) {
        return parent.appendChild(el); // Append the second parameter(element) to the first one
    }

    function wrapInPara(text) {
        return '<p><samp>' + text + '</samp></p>';
    }

    function appendChild(idSelector, text) {
        var myDiv = document.getElementById(idSelector);
        if (myDiv) {
            var myContent = document.createElement("p");
            myContent.appendChild(document.createTextNode(text));
            myDiv.appendChild(myContent);
        }
    }
    function replaceContent(idSelector, text) {
        var myDiv = document.getElementById(idSelector);
        if (myDiv) {
            myDiv.innerHTML = text;
        }
    }

    function currentCookies() {
        var cookieslist = document.cookie.split('; ');
        var cookiesFormatted = "";
        cookieslist.forEach(function (item) {
            if (item && item.length) {
                cookiesFormatted += wrapInPara(item);
            }
        })
        replaceContent("cookieContent", cookiesFormatted);
        console.log('current cookies = ' + JSON.stringify(Cookies.get()));
    }

    function currentURL() {
        replaceContent("currentUrl", "current url: " + document.location.href);
    }

    function clearCookies() {
        var cookieslist = document.cookie.split('; ');
        cookieslist.forEach(function (item) {
            if (item && item.length) {
                key = item.split('=')[0];
                Cookies.remove(key,  {path:'/', domain: 'quickbase.com.dev'});
                //document.cookie = key + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/";
            }
        });
        currentCookies();
    }

    function clickHandler(urlToFetch, responseCallback) {
        //get json from current qb
        //this get will do a options prefetch test first since its setting allow-origin
        var requestConfig =  {
            url : urlToFetch,
            method: 'get',
            responseType: 'json',
            withCredentials: true,
            headers: {
                'Content-Type': 'text/json',
                'Access-Control-Allow-Origin': true
            }
        };
        axios.get(urlToFetch, requestConfig)
            .then((data) => {
                return data.data;
            })
            .then((json) => {
                // Here you get the data to modify as you please
                //check to see if the result is a url redirect
                //what to send as reply after getcreds - url
                responseCallback(json);
            })
            .catch((error) => {
                // If there is any error you will catch them here
                console.log("error getting request.url: " + requestConfig.url + " error:" + JSON.stringify(error, null, 2));
            });
    };

    function clickHandlerPets() {
        clickHandler('http://testRealm.quickbase.com.dev/pets', function (json) {
            // Here you get the data to modify as you please
            var petslist = json;
            var msg = 'petslist:' + JSON.stringify(petslist);
            console.log(msg);
            appendChild('outputPet', msg);
            currentCookies();
        });
    }

    function clickHandlerCattle() {
        clickHandler('http://testRealm.hybrid.quickbase.com.dev/cattle', function (json) {
            // Here you get the data to modify as you please
            var cattlelist = json;
            var msg = 'cattlelist:' + JSON.stringify(cattlelist);
            console.log(msg);
            appendChild('outputCattle', msg);
            currentCookies();
        });
    }

    function clickHandlerEvil() {
        clickHandler('http://www.evil.dev/bad', function (json) {
            // Here you get the data to modify as you please
            var badlist = json;
            var msg = 'badlist:' + JSON.stringify(badlist);
            console.log(msg);
            appendChild('outputBad', msg);
            currentCookies();
        });
    }

    function clickHandlerEvilRealm() {
        clickHandler('http://evilrealm.quickbase.com.dev/badrealm', function (json) {
            // Here you get the data to modify as you please
            var badlist = json;
            var msg = 'badlist:' + JSON.stringify(badlist);
            console.log(msg);
            appendChild('outputBad', msg);
            currentCookies();
        });
    }

    function addHandler(id, functionName) {
        var elt = document.getElementById(id);
        if (elt){
            elt.onclick = functionName;
        }
    }
    currentURL();
    currentCookies();
    addHandler("getHybrid", clickHandlerCattle);
    addHandler("getCurrent", clickHandlerPets);
    addHandler("getEvil", clickHandlerEvil);
    addHandler("getEvilRealm", clickHandlerEvilRealm);
    addHandler("clearCookies", clearCookies);
});
