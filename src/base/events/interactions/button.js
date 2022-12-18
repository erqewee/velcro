import { Event } from "../../structures/export.js";

export default class extends Event {
    constructor() {
        super({ enabled: true, type: "Button" });

        this.setName(this.Events.Discord.InteractionCreate);

        this.execute = async function (interaction) {
            const db = this.databases.general;

            if (!String(interaction.customId).toLowerCase().includes("survey")) return;

            const emojiUp = this.emojis.cache.get("1031179456917803100");
            const emojiDown = this.emojis.cache.get("1031178994743267368");

            const surveys = db.fetch(`Guild_${interaction.guild.id}.Surveys.List`);

            let style = { UP: this.ButtonStyle.Primary, DOWN: this.ButtonStyle.Primary };

            return surveys?.map((survey) => {
                if (interaction.customId === `survey_${interaction.guild.id}-${survey.id}-up`) {
                    const votedUsers = db.fetch(`Guild_${interaction.guild.id}.Surveys.Survey-${survey.id}.Votes.Users`) ?? [];
                    if (votedUsers.includes(interaction.user.id)) return interaction.reply({ content: `${this.config.Emoji.State.ERROR} You already voted this survey.`, ephemeral: true });

                    const upVotes = db.add(`Guild_${interaction.guild.id}.Surveys.Survey-${survey.id}.Votes.UP`, 1);
                    const downVotes = db.fetch(`Guild_${interaction.guild.id}.Surveys.Survey-${survey.id}.Votes.DOWN`);

                    if (upVotes < downVotes) {
                        style.UP = this.ButtonStyle.Danger;
                        style.DOWN = this.ButtonStyle.Success;
                    } else if (upVotes > downVotes) {
                        style.UP = this.ButtonStyle.Success;
                        style.DOWN = this.ButtonStyle.Danger;
                    } else if (upVotes === downVotes) {
                        style.UP = this.ButtonStyle.Secondary;
                        style.DOWN = this.ButtonStyle.Secondary;
                    };

                    const buttons = {
                        up: new this.Button({
                            style: style.UP,
                            customId: `survey_${interaction.guild.id}-${survey.id}-up`,
                            label: `Up (${upVotes})`,
                            emoji: { id: emojiUp.id, name: emojiUp.name, animated: emojiUp.animated }
                        }),

                        down: new this.Button({
                            style: style.DOWN,
                            customId: `survey_${interaction.guild.id}-${survey.id}-down`,
                            label: `Down (${downVotes})`,
                            emoji: { id: emojiDown.id, name: emojiDown.name, animated: emojiDown.animated }
                        })
                    };

                    const row = new this.Row({ components: [buttons.up, buttons.down] });

                    db.push(`Guild_${interaction.guild.id}.Surveys.Survey-${survey.id}.Votes.Users`, interaction.user.id);

                    return interaction.update({ components: [row] });
                } else if (interaction.customId === `survey_${interaction.guild.id}-${survey.id}-down`) {
                    const votedUsers = db.fetch(`Guild_${interaction.guild.id}.Surveys.Survey-${survey.id}.Votes.Users`) ?? [];
                    if (votedUsers.includes(interaction.user.id)) return interaction.reply({ content: `${this.config.Emoji.State.ERROR} You already voted this survey.`, ephemeral: true });

                    const upVotes = db.fetch(`Guild_${interaction.guild.id}.Surveys.Survey-${survey.id}.Votes.UP`);
                    const downVotes = db.add(`Guild_${interaction.guild.id}.Surveys.Survey-${survey.id}.Votes.DOWN`, 1);

                    if (upVotes < downVotes) {
                        style.UP = this.ButtonStyle.Danger;
                        style.DOWN = this.ButtonStyle.Success;
                    } else if (upVotes > downVotes) {
                        style.UP = this.ButtonStyle.Success;
                        style.DOWN = this.ButtonStyle.Danger;
                    } else if (upVotes === downVotes) {
                        style.UP = this.ButtonStyle.Secondary;
                        style.DOWN = this.ButtonStyle.Secondary;
                    };

                    const buttons = {
                        up: new this.Button({
                            style: style.UP,
                            customId: `survey_${interaction.guild.id}-${survey.id}-up`,
                            label: `Up (${upVotes})`,
                            emoji: { id: emojiUp.id, name: emojiUp.name, animated: emojiUp.animated }
                        }),

                        down: new this.Button({
                            style: style.DOWN,
                            customId: `survey_${interaction.guild.id}-${survey.id}-down`,
                            label: `Down (${downVotes})`,
                            emoji: { id: emojiDown.id, name: emojiDown.name, animated: emojiDown.animated }
                        })
                    };

                    const row = new this.Row({ components: [buttons.up, buttons.down] });

                    db.push(`Guild_${interaction.guild.id}.Surveys.Survey-${survey.id}.Votes.Users`, interaction.user.id);

                    return interaction.update({ components: [row] });
                };
            });
        };
    };
};