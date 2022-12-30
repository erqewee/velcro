import { API } from "../API.js";
const api = new API();

import { ChannelManager as BaseChannelManager } from "../Channel/ChannelManager.js";
const ChannelManager = new BaseChannelManager();

const { PATCH, POST, PUT, GET, DELETE } = api;

export class WebhookManager {
  constructor() { };

  get(webhookID) {
    if (!api.checker.check(webhookID).isString()) api.checker.error("webhookId", "InvalidType", { expected: "String", received: (typeof webhookID) });

    const webhook = GET(`${api.config.BASE_URL}/webhooks/${webhookID}`);

    return webhook;
  };

  create(channelID, options = {
    name: null,
    avatar: null
  }) {
    if (!api.checker.check(channelID).isString()) api.checker.error("channelId", "InvalidType", { expected: "String", received: (typeof channelID) });

    const channel = ChannelManager.get(channelID);
    const webhook = POST(`${api.config.BASE_URL}/${api.config.VERSION}/channels/${channel.id}/webhooks`, {
      name: options?.name,
      avatar: options?.avatar
    });

    return webhook;
  };

  message(webhookID, options = {
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
    if (!api.checker.check(webhookID).isString()) api.checker.error("webhookId", "InvalidType", { expected: "String", received: (typeof webhookID) });

    const webhook = this.get(webhookID);

    const message = POST(`${api.config.BASE_URL}/webhooks/${webhook.id}/${webhook.token}`, {
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

  delete(webhook) {
    if (!api.checker.check(webhook).isObject()) api.checker.error("webhook", "InvalidType", { expected: "Object", received: (typeof webhook) });

    const fetched = this.get(webhook.id);

    const deleted = DELETE(`${api.config.BASE_URL}/webhooks/${fetched.id}/${fetched.token}`);

    return deleted;
  };
};