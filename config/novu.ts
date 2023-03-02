import { Novu } from "@novu/node";
import { TriggerRecipientsTypeEnum } from "@novu/shared";
import { novuApiKey } from ".";
const novu = new Novu(novuApiKey);

const createNewSubscriber = ({
  id,
  firstName,
  lastName,
  email,
  phoneNumber: phone,
  avatar,
}: any) =>
  novu.subscribers.identify(id.toString(), {
    firstName,
    lastName,
    email,
    phone,
    avatar,
  });

const removeSubscriber = (id: any) => novu.subscribers.delete(id);

const broadCastNotification = (eventId: string, payload: any) =>
  novu.broadcast(eventId, {
    payload,
  });

const createTopic = ({ key, name }: any) => novu.topics.create({ key, name });

const checkTopicExisted = (topicKey: string) =>
  novu.topics.get(topicKey).catch(() => false);

const addSubscribersToTopic = (topicKey: string, subscribers: string[]) =>
  novu.topics.addSubscribers(topicKey, {
    subscribers,
  });

const triggerToTopic = ({ eventId, payload, topicKey }: any) =>
  novu.trigger(eventId, {
    to: [
      {
        type: TriggerRecipientsTypeEnum.TOPIC,
        topicKey,
      },
    ],
    payload,
  });

const removeSubscribersFromTopic = (topicKey: string, subscribers: string[]) =>
  novu.topics.removeSubscribers(topicKey, {
    subscribers,
  });

export const novuHelpers = {
  createNewSubscriber,
  removeSubscriber,
  broadCastNotification,
  createTopic,
  addSubscribersToTopic,
  removeSubscribersFromTopic,
  triggerToTopic,
  checkTopicExisted,
};
