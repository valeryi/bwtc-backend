import { confirm as confirmHandler } from './confirm';

export const confirm = [
    {
        path: '/confirm/*',
        method: 'get',
        handler: confirmHandler
    }
]


