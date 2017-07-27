const owners = require("../config.json").users.owners;

module.exports = {

	hasRole(member, rolename) {
		if (!member.guild) return false;
		let role = member.guild.roles.find(r => r.name === rolename);
		return (role && member.roles.has(role.id));
	},

	isAdmin(member) {
		return (owners.includes(member.id) || member.guild.ownerID === member.id || member.permissions.has('ADMINISTRATOR') || module.exports.hasRole(member, "Mod"))? true : false;
	},

	isDJ(member, client) {
		return (module.exports.hasRole(member, "DJ") || client.queues[member.guild.id].dj == member.id);
	},

	isBlocked(member) {
		let blockList = require(`../config.json`).users.blocked;
		delete require.cache[require.resolve(`../config.json`)];

		return ((module.exports.hasRole(member, "NoMusicPerms") || blockList.includes(member.id)) && !owners.includes(member.id) && member.guild.ownerID !== member.id);
	},

	IsBlacklisted(member) {
		let blacklist = require('../data/blacklist.json')[member.guild.id];
		
	}

}