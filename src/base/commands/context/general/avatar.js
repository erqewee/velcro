import { ContextCommand } from "../../../structures/export.js";

export default class extends ContextCommand {
  constructor() {
    super({ enabled: true, mode: "Global" });

    this.setCommand(new this.ContextCommand()
      .setName("Avatar")
      .setType(this.CommandType.User)
    );
  };

  async execute({ interaction, member, target, guild }) {
    await interaction.deferReply();

    const user = target.user;

    const grabbedMember = user ? guild.members.resolve(user.id) : member;

    const avatarURL = (extension = "png", size = 1024) => grabbedMember?.displayAvatarURL({ extension, size });

    const embed = new this.Embed({
      title: this.translate("data:commands.avatar.title", { variables: [ { name: "member", value: grabbedMember.user.username } ] }) + ` (PNG)`,
    }).setImage(avatarURL() ?? this.client.user?.avatarURL());


    const camera = this.emojis.cache.get("892049008321785857");
    let emoji = { animated: camera.animated, id: camera.id, name: camera.name };

    const menu = new this.Row({
      components: [
        new this.StringMenu({
          customId: "avatarFormat",
          placeholder: "Avatar Format",
          maxValues: 1,
          minValues: 1,
          options: [
            {
              label: "PNG",
              description: "Get user avatar with 'PNG' format.",
              emoji,
              value: "png",
            },
            {
              label: "JPG",
              description: "Get user avatar with 'JPG' format.",
              emoji,
              value: "jpg"
            },
            {
              label: "WEBP",
              description: "Get user avatar with 'WEBP' format.",
              emoji,
              value: "webp"
            }
          ]
        })
      ]
    });

    const disabledMenu = new this.Row({
      components: [
        new this.StringMenu({
          customId: "avatarFormat",
          placeholder: "Avatar Format",
          maxValues: 1,
          minValues: 1,
          options: [
            {
              label: "PNG",
              description: "Get user avatar with 'PNG' format.",
              emoji,
              value: "png",
            },
            {
              label: "JPG",
              description: "Get user avatar with 'JPG' format.",
              emoji,
              value: "jpg"
            },
            {
              label: "WEBP",
              description: "Get user avatar with 'WEBP' format.",
              emoji,
              value: "webp"
            }
          ],
          disabled: true
        })
      ]
    });

    await interaction.editReply({ embeds: [ embed ], components: [ menu ] }).then(async (m) => {
      const collector = await m.createMessageComponentCollector({ type: this.Component.StringSelect });

      collector.on("collect", async (i) => {
        if (i.customId !== "avatarFormat") return;

        const value = i.values[ 0 ].toLowerCase();

        const format = new this.Embed({
          title: this.translate("data:commands.avatar.title", { variables: [ { name: "member", value: grabbedMember.user.username } ] }) + ` (${value.toUpperCase()})`,
        }).setImage(avatarURL(value) ?? this.client.user?.avatarURL({ extension: value }));

        await i.update({ embeds: [ format ], components: [ menu ] });

        setTimeout(() => i.editReply({ components: [ disabledMenu ] }), 60000);
      });
    });
  };
};