// https://github.com/tokenbankteam/documents/blob/821328b872158413e8792ef55c529bd858106d0e/tb_im_api.md
export const IM = {
    LOGIN: `/v1/im/login`,
    CREATE: `/v1/im/create`,
    ACCOUNT_BLOCK: `/v1/im/account_block`,
    ACCOUNT_UNBLOCK: `/v1/im/account_unblock`,
    FOLLOW_LIST: `/v1/im/follow_list`,
    FOLLOW_ACCOUNT: `/v1/im/follow_account1`,
    UN_FOLLOW_ACCOUNT: `/v1/im/unfollow_account1`,
    IS_FOLLOW: `/v1/im/is_follow`,
    SEARCH_LIST: `/v1/im/search_list`,
}

export const DApp = {
    GET_NEWS_LIST: `/v1/news/list`,
    GET_BANNER_LIST: `/v1/banner/list`,
    GET_ACTIVITY_LIST: `/v1/activity/list`,
    GET_CATEGORY_LIST: `/v1/category/list`,
    GET_DAPP_LIST: `/v1/application/list`,
    GET_ASSET: `/v1/token/listbyacc`,
}
