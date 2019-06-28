const nHentaiAPI = require('nhentai-api-js');
let api = new nHentaiAPI();

const { RichEmbed } = require("discord.js");
const TYPE = {
  j: 'jpg',
  p: 'png',
  g: 'gif'
};

class NanaEmbeds {
    constructor(client) {
        this.client = client;
    }
  
    getRandom() {
        return new Promise(async (fulfill, reject) => {
            try {
                fulfill(api.random())
            } catch (err) {
                reject(err)
            }
        })
    }
  
    getById(id) {
        return new Promise(async (fulfill, reject) => {
            try {
                fulfill(api.g(id))
            } catch (err) {
                reject(err)
            }
        })
    }
  
    getInfo(res) {
        var json = {};
      
        let lang = res.tags.filter(x => x.type == 'language').map(x => x.name);
        json.tag = res.tags.filter(x => x.type == 'tag').map(x => this.client.util.toPlural(x.name));
        json.category = res.tags.filter(x => x.type == 'category').map(x => this.client.util.toPlural(x.name));
        json.artist = res.tags.filter(x => x.type == 'artist').map(x => this.client.util.toPlural(x.name));
        json.parody = res.tags.filter(x => x.type == 'parody').map(x => this.client.util.toPlural(x.name));
        json.character = res.tags.filter(x => x.type == 'character').map(x => this.client.util.toPlural(x.name));
        json.cover = `https://t.nhentai.net/galleries/${res.media_id}/cover.${TYPE[res.images.cover.t]}`;
        json.thumb = `https://t.nhentai.net/galleries/${res.media_id}/thumb.${TYPE[res.images.cover.t]}`;

        if (lang[0] == 'translated') {
          json.lang = this.client.util.toPlural(lang[1]);
        } else {
          json.lang = this.client.util.toPlural(lang[0]);
        }
      
        return json;
    }  
  
    getInfoEmbed(id, msg) {
        return new Promise(async (fulfill, reject) => {
          try{
            const embed = new RichEmbed();
            let res = (await this.getById(id))
            let info = this.getInfo(res);
    
            // console.log(info);
            embed.setAuthor('nHentai random generator', this.client.nHlogo);
            embed.setColor(this.client.config.COLOR);
            // embed.setThumbnail(thumb);
            embed.setTitle(`${res.title.pretty}`);
            embed.setDescription(`Made by: **${info.artist[0] ? info.artist.join(', ') : info.artist}**`);
            embed.setURL(`https://nhentai.net/g/${res.id}`);
            embed.setImage(info.cover);
            embed.setFooter(`React with 📖 to continue reading / ${res.id}`)
            embed.addField('Language', info.lang, true);
            if (info.parody[0]) embed.addField('Parody', info.parody[0] ? info.parody.join(', ') : info.parody, true);
            if (info.character[0]) embed.addField('Characters', info.character[0] ? info.character.join(', ') : info.character, true);
            if (info.category[0]) embed.addField('Categories', info.category, true)
            embed.addField('Pages', res.num_pages, true)
            if (info.tag[0]) embed.addField('Tags', info.tag[0] ? info.tag.join(', ') : info.tag)
            let m = await msg.channel.send(embed);
            this.getEmoji(id, m, msg)
            
            fulfill();
          } catch (err) {
            reject(err);
          }
        });
    }
  
    getEmoji(id, m, msg) {
        return new Promise(async (fulfill, reject) => {
          try {
            let res = (await this.getById(id));
            let info = this.getInfo(res);
            let doujin = [];
            res.images.pages.forEach((page, i) => {
                doujin.push(`https://i.nhentai.net/galleries/${res.media_id}/${i+1}.${TYPE[page.t]}`);
            });
            let pagination = 1;

            await m.react('🔴');
            await m.react('📖');
            await m.react('💾');

            const deleteFilter = (reaction, user) => reaction.emoji.name === `🔴` && user.id === msg.author.id;
            const forwardsFilter = (reaction, user) => reaction.emoji.name === `📖` && user.id === msg.author.id;
            const downloadFilter = (reaction, user) => reaction.emoji.name === `💾` && user.id !== this.client.user.id;
            const deletes = m.createReactionCollector(deleteFilter);
            const forwards = m.createReactionCollector(forwardsFilter);
            const download = m.createReactionCollector(downloadFilter);

            forwards.on('collect', async f => {
                m.delete(this.getInfoEmbed);

                // read embed
                const read = new RichEmbed();
                read.setAuthor('nHentai read', this.client.nHlogo);
                read.setColor(this.client.config.COLOR);
                read.setTitle(`${res.title.pretty}`);
                read.setDescription(`Made by: **${info.artist[0] ? info.artist.join(', ') : info.artist}**`);
                read.setURL(`https://nhentai.net/g/${res.id}`);
                read.setImage(doujin[pagination-1]);
                read.setFooter(`Page ${pagination} of ${doujin.length} / ${res.id}`)
                let r = await msg.channel.send(read);
                return this.getRead(res, read, r, msg)

            });

            deletes.on('collect', d => {
                return m.delete(this.getInfoEmbed);
            });

            download.on('collect', d => {
                let download = new RichEmbed()
                .setColor(this.client.config.COLOR)
                .setURL(`https://dl.nhent.ai/dl/${res.id}`)
                .setTitle(`Download: ${res.title.pretty}`)
                .setDescription(`Click the link above to start downloading \`${res.title.pretty}\``)
                return msg.channel.send(download);
            });
            
          fulfill();
          } catch (err) {
              reject(err);
          }
        });
    }
  
   getRead(res, read, r, msg) {
      return new Promise(async (fulfill, reject) => {
        try {
          let doujin = [];
          res.images.pages.forEach((page, i) => {
              doujin.push(`https://i.nhentai.net/galleries/${res.media_id}/${i+1}.${TYPE[page.t]}`);
          });
          let pagination = 1;
          
          await r.react('⏪');
          await r.react('⬅');      
          await r.react('🔴');
          await r.react('➡');
          await r.react('⏩');

          const backwardsTenFilter = (reaction, user) => reaction.emoji.name === `⏪` && user.id === msg.author.id;
          const backwardsFilter = (reaction, user) => reaction.emoji.name === `⬅` && user.id === msg.author.id;
          const deleteFilter = (reaction, user) => reaction.emoji.name === `🔴` && user.id === msg.author.id;
          const forwardsFilter = (reaction, user) => reaction.emoji.name === `➡` && user.id === msg.author.id;
          const forwardsTenFilter = (reaction, user) => reaction.emoji.name === `⏩` && user.id === msg.author.id;
          const backwardsTen = r.createReactionCollector(backwardsTenFilter);
          const backwards = r.createReactionCollector(backwardsFilter);
          const deletes = r.createReactionCollector(deleteFilter);
          const forwards = r.createReactionCollector(forwardsFilter);
          const forwardsTen = r.createReactionCollector(forwardsTenFilter);

          backwardsTen.on('collect', bt => {
              bt.remove(msg.author.id);
              if (pagination <= 5) return;
              pagination-=5;
              read.setImage(doujin[pagination-1])
              read.setFooter(`Page ${pagination} of ${doujin.length} / ${res.id}`)
              r.edit(read);
          });

          backwards.on('collect', b => {
              b.remove(msg.author.id);
              if (pagination == 1) return;
              pagination--;
              read.setImage(doujin[pagination-1])
              read.setFooter(`Page ${pagination} of ${doujin.length} / ${res.id}`)
              r.edit(read);
          });

          forwards.on('collect', f => {
              f.remove(msg.author.id);
              if (pagination == doujin.length) return;
              pagination++;
              read.setImage(doujin[pagination-1])
              read.setFooter(`Page ${pagination} of ${doujin.length} / ${res.id}`)
              r.edit(read);
          });

         forwardsTen.on('collect', ft => {
              ft.remove(msg.author.id);
              if (pagination+5 >= doujin.length) return;
              pagination+=5;
              read.setImage(doujin[pagination-1])
              read.setFooter(`Page ${pagination} of ${doujin.length} / ${res.id}`)
              r.edit(read);
          });

          deletes.on('collect', d => {
              r.delete(read);
          });
          
      fulfill();
      } catch (err) {
          reject(err);
      }
    })
   }
}
module.exports = NanaEmbeds;
