const { Plugin } = require("powercord/entities");
const injector = require("powercord/injector");
const { getModule } = require("powercord/webpack");
const changeNickname = getModule(["changeNickname"], false).changeNickname;
const getGuilds = getModule(["getGuilds"], false).getGuilds;

const exceptions = ["bi", "bien", "bisexuel", "bisexual"];

let id = 0;

module.exports = class BiIrl extends Plugin {
	startPlugin() {
		const notices = powercord.api.notices;
		injector.uninject("biIrl");
		injector.inject(
			"biIrl",
			getModule(["sendMessage"], false),
			"sendMessage",
			([, { content }], res) => {
				const arr = content.split(/\s+/);
				const matches = [];
				for (let word of arr) {
					const lword = word.toLowerCase();
					if (lword.startsWith("bi") && !exceptions.includes(lword)) {
						matches.push(word);
					}
				}

				if (matches.length > 0) {
					const toastId = "biIrl" + id++;
					notices.sendToast(toastId, {
						header: "bi_irl",
						content: "Words found: " + matches.join(", "),
						timeout: 5000,
						hideProgressBar: false,
						buttons: [
							{ text: "Message", onClick: () => {} },
							{
								text: "Set nickname",
								onClick: () => {
									const guilds = getGuilds();
									const ids = Object.keys(guilds);
									const guild = guilds[ids[(ids.length * Math.random()) << 0]];
									const rndWord = matches[
										(matches.length * Math.random()) << 0
									].replace("bi", "bi ");
									changeNickname(guild.id, null, "@me", rndWord);
									notices.sendToast(toastId + "Set", {
										header: "bi_irl",
										content: "Set nickname " + rndWord + " on " + guild.name,
										timeout: 3000,
									});
								},
							},
						],
					});
				}
				return res;
			}
		);
	}
};
