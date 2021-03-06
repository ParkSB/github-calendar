"use strict";

var $ = require("elly");

/**
 * GitHubCalendar
 * Brings the contributions calendar from GitHub (provided username) into your page.
 *
 * @name GitHubCalendar
 * @function
 * @param {String|HTMLElement} container The calendar container (query selector or the element itself).
 * @param {String} username The GitHub username.
 * @param {Object} options An object containing the following fields:
 *
 *    - `summary_text` (String): The text that appears under the calendar (defaults to: `"Summary of
 *      pull requests, issues opened, and commits made by <username>"`).
 *    - `proxy` (Function): A function that receives as argument an url (string) and should return the proxied url.
 *      The default is using [@izuzak](https://github.com/izuzak)'s [`urlreq`](https://github.com/izuzak/urlreq).
 *    - `global_stats` (Boolean): If `false`, the global stats (total, longest and current streaks) will not be calculated and displayed. By default this is enabled.
 *    - `responsive` (Boolean): If `true`, the graph is changed to scale with the container. Custom CSS should be applied to the element to scale it appropriately. By default this is disabled.
 *
 * @return {Promise} A promise returned by the `fetch()` call.
 */
module.exports = function GitHubCalendar(container, username, options) {

    container = $(container);

    options = options || {};

    if (options.global_stats === false) {
        container.style.minHeight = "175px";
    }

    // We need a proxy for CORS
    // Thanks, @izuzak (https://github.com/izuzak/urlreq)
    options.proxy = options.proxy || function (url) {
        return "https://urlreq.appspot.com/req?method=GET&url=" + url;
    };

    var fetchCalendar = function fetchCalendar() {
        return fetch(options.proxy("https://github.com/" + username)).then(function (response) {
            return response.text();
        }).then(function (body) {
            var div = document.createElement("div");
            div.innerHTML = body;
            var cal = div.querySelector(".js-yearly-contributions");
            $(".position-relative h2", cal).remove();

            // If 'include-fragment' with spinner img loads instead of the svg, fetchCalendar again
            if (cal.querySelector("include-fragment")) {
                setTimeout(fetchCalendar, 500);
            } else {
                // If options includes responsive, SVG element has to be manipulated to be made responsive
                if (options.responsive === true) {
                    var svg = cal.querySelector("svg.js-calendar-graph-svg");
                    // Get the width/height properties and use them to create the viewBox
                    var width = svg.getAttribute("width");
                    var height = svg.getAttribute("height");
                    // Remove height property entirely
                    svg.removeAttribute("height");
                    // Width property should be set to 100% to fill entire container
                    svg.setAttribute("width", "100%");
                    // Add a viewBox property based on the former width/height
                    svg.setAttribute("viewBox", "0 0 " + width + " " + height);
                }

                container.innerHTML = cal.innerHTML;
            }
        }).catch(function (e) {
            return console.error(e);
        });
    };

    return fetchCalendar();
};