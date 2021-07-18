// utils -> fetchEmbed

const fetch = require('node-fetch').default;

const isInstagram = (provider) => {
  return provider.provider_name === 'Instagram';
};

const getInstGraphUrl = (query, credentials) => {
  const baseUrl = 'https://graph.facebook.com/v8.0/instagram_oembed';
  const appId = credentials.facebookAppId || '365101066946402';
  const clientToken = credentials.facebookClientToken || 'a56861eb5b787f9e9a18e4e09ea5c873';
  return `${baseUrl}?${query}&access_token=${appId}|${clientToken}`;
};

const getRegularUrl = (query, basseUrl) => {
  return basseUrl.replace(/\{format\}/g, 'json') + '?' + query;
};

const createLink = (url, provider, params = {}) => {
  const queries = [
    'format=json',
    `url=${encodeURIComponent(url)}`,
  ];

  const {
    maxwidth = 0,
    maxheight = 0,
    credentials = {},
  } = params;

  if (maxwidth > 0) {
    queries.push(`maxwidth=${maxwidth}`);
  }
  if (maxheight > 0) {
    queries.push(`maxheight=${maxheight}`);
  }
  const query = queries.join('&');

  const link = isInstagram(provider) ? getInstGraphUrl(query, credentials) : getRegularUrl(query, provider.url);
  return link;
};

const fetchEmbed = async (url, provider, params = {}) => {
  const link = createLink(url, provider, params);
  const res = await fetch(link, {mode: 'no-cors'});
  const json = await res.json();

  const {
    provider_name, // eslint-disable-line camelcase
    provider_url, // eslint-disable-line camelcase
  } = provider;
  json.provider_name = provider_name; // eslint-disable-line camelcase
  json.provider_url = provider_url; // eslint-disable-line camelcase
  return json;
};

module.exports = {
  fetchEmbed,
  createLink,
};
