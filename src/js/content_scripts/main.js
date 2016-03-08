/**
 * Created by steve on 08/03/2016.
 */
'use strict';

const settings_key = 'dsmp_settings';

/*
{
    blockedSites : [
        {hostName : 'facebook.com', limit : 3, current : 2}
    ],
}
 */

class PageManager {
    constructor() {
        this.hostName = window.location.hostname.toLowerCase();

        this.loadSettings();
        this.checkPage();
    }

    checkPage() {
        if (!this.settings.blockedSites) {
            return;
        }

        //is the current site in our banned list
        let site = this.settings.blockedSites.find(host => this.hostName.includes(host.hostName));

        //if it's not in the banned list - no problem, carry on
        if (!site) {
            return;
        }

        const current = site.current || 0,
            notificationOptions = {
                type: "basic",
                title: "Do something more productive"
                //TODO iconUrl: "url_to_small_icon"
            };

        if (current >= site.limit) {
            window.location.replace('http://www.google.com');
            notificationOptions.message = 'Do Something more useful! You have visited this site too many times today';
        } else {
            site.current ++;
            notificationOptions.message = `You have visited this site ${site.current} times today of a maximum of ${site.limit}`;
        }


        this.saveSettings();

        //TODO this doesn't fire because you can't do it from content scripts - need to fire off a message
        //see http://stackoverflow.com/questions/20317388/chrome-extension-rich-notifications-not-working
        chrome.notifications.create(0, notificationOptions);
    }

    loadSettings() {
        let settings = window.localStorage.getItem(settings_key);

        if (!settings) {
            this.settings = {};
            return;
        }

        this.settings = JSON.parse(settings);
    }

    saveSettings() {
        if (!this.settings) {
            return;
        }
        window.localStorage.setItem(settings_key, JSON.stringify(this.settings));
    }
}

const manager = new PageManager();