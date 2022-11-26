import { Manager } from "../Manager.js";

import { ChannelManager as BaseChannelManager } from "../Channel/ChannelManager.js";
const ChannelManager = new BaseChannelManager();

export class WebhookManager {
  constructor() {
    this.get = async function (webhookID) {
      if (typeof webhookID !== "string") throw new TypeError("WebhookID must be a STRING!");

      const webhook = await Manager.GET(`${Manager.config.BASE_URL}/webhooks/${webhookID}`);

      return webhook;
    };

    this.create = async function(channelID, options = {
      name: null,
      avatar: null
    }) {
      if (typeof channelID !== "string") throw new TypeError("ChannelID must be a STRING!");

      const channel = await ChannelManager.get(channelID);
      const webhook = await Manager.POST(`${Manager.config.BASE_URL}/${Manager.config.VERSION}/channels/${channel.id}/webhooks`, {
        name: options?.name,
        avatar: options?.avatar
      });

      return webhook;
    };

    this.message = async function (webhookID, options = {
      content: null,
      embeds: [],
      flags: 0,
      allowedMentions: {},
      components: [],
      files: [],
      payloadJson: null,
      attachments: [],
      nonce: null,
      tts: false,
      messageReference: {},
      stickerIds: []
    }) {
      if (typeof webhookID !== "string") throw new TypeError("WebhookID must be a STRING!");

      const webhook = await this.get(webhookID);

      const message = await Manager.POST(`${Manager.config.BASE_URL}/webhooks/${webhook.id}/${webhook.token}`, {
        content: options?.content,
        embeds: options?.embeds,
        flags: options?.flags,
        allowed_mentions: options?.allowedMentions,
        components: options?.attachments,
        files: options?.files,
        payload_json: options?.payloadJson,
        attachments: options?.attachments,
        nonce: options?.nonce,
        tts: options?.tts,
        message_reference: options?.messageReference,
        sticker_ids: options?.stickerIds
      });

      return message;
    };

    this.delete = async function(webhook_) {

      const fetchWebhook = await this.get(webhook_.id);
    
      const webhook = await Manager.DELETE(`${Manager.config.BASE_URL}/webhooks/${fetchWebhook.id}/${fetchWebhook.token}`);

      return webhook;
    };
  };
};