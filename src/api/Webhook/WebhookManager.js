import { API } from "../API.js";
const api = new API();

import { ChannelManager as BaseChannelManager } from "../Channel/ChannelManager.js";
const ChannelManager = new BaseChannelManager();

const { PATCH, POST, PUT, GET, DELETE } = api;

export class WebhookManager {
  constructor() { };

  async get(webhookID) {
    if (!api.checker.check(webhookID).isString()) api.checker.error("webhookId", "InvalidType", { expected: "String", received: (typeof webhookID) });

    const webhook = await GET(`${api.config.BASE_URL}/webhooks/${webhookID}`);

    return webhook;
  };

  async create(channelID, options = {
    name: null,
    avatar: null
  }) {
    if (!api.checker.check(channelID).isString()) api.checker.error("channelId", "InvalidType", { expected: "String", received: (typeof channelID) });

    const channel = await ChannelManager.get(channelID);
    const webhook = await POST(`${api.config.BASE_URL}/${api.config.VERSION}/channels/${channel.id}/webhooks`, {
      json: {
        name: options?.name,
        avatar: options?.avatar
      }
    });

    return webhook;
  };

  async message(webhookID, options = {
    content: null,
    embeds: [],
    flags: 0,
    allowedMentions: {},
    components: [],
    files: [],
    payloadJSON: null,
    attachments: [],
    nonce: null,
    tts: false,
    messageReference: {},
    stickerIds: []
  }) {
    if (!api.checker.check(webhookID).isString()) api.checker.error("webhookId", "InvalidType", { expected: "String", received: (typeof webhookID) });

    const webhook = await this.get(webhookID);

    const message = await POST(`${api.config.BASE_URL}/webhooks/${webhook.id}/${webhook.token}`, {
      json: {
        content: options?.content,
        embeds: options?.embeds,
        flags: options?.flags,
        allowed_mentions: options?.allowedMentions,
        components: options?.attachments,
        files: options?.files,
        payload_json: options?.payloadJSON,
        attachments: options?.attachments,
        nonce: options?.nonce,
        tts: options?.tts,
        message_reference: options?.messageReference,
        sticker_ids: options?.stickerIds
      }
    });

    return message;
  };

  async delete(webhook) {
    if (!api.checker.check(webhook).isObject()) api.checker.error("webhook", "InvalidType", { expected: "Object", received: (typeof webhook) });

    const fetched = await this.get(webhook.id);

    const deleted = DELETE(`${api.config.BASE_URL}/webhooks/${fetched.id}/${fetched.token}`);

    return deleted;
  };
};