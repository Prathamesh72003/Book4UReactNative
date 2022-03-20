import axios from 'axios';

const instance = axios.create({
  baseURL:
    'https://us-east-1.aws.webhooks.mongodb-realm.com/api/client/v2.0/app/book4u-gmvsx/service/book4u/incoming_webhook',
});

export default instance;
