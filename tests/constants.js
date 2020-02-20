export const PARAGRAPH = [
    {
        type: 'paragraph',
        children: [
            {
                text: 'Just a text',
            },
        ],
    },
];

export const SIMPLE_LIST = [
    {
        type: 'ul_list',
        children: [
            {
                type: 'list_item',
                children: [
                    {
                        type: 'paragraph',
                        children: [
                            {
                                text: 'List item',
                            },
                        ],
                    },
                ],
            },
        ],
    },
];

export const NESTED_LIST = [
    {
        type: 'ul_list',
        children: [
            {
                type: 'list_item',
                children: [
                    {
                        type: 'ul_list',
                        children: [
                            {
                                type: 'list_item',
                                children: [
                                    {
                                        type: 'paragraph',
                                        children: [
                                            {
                                                text: 'Nested list item',
                                            },
                                        ],
                                    },
                                ],
                            },
                        ],
                    },
                ],
            },
        ],
    },
];

export const COMPLICATED_LIST = [
    {
        type: 'ul_list',
        children: [
            {
                type: 'list_item',
                children: [
                    {
                        type: 'ul_list',
                        children: [
                            {
                                type: 'list_item',
                                children: [
                                    {
                                        type: 'ul_list',
                                        children: [
                                            {
                                                type: 'list_item',
                                                children: [
                                                    {
                                                        type: 'ul_list',
                                                        children: [
                                                            {
                                                                type:
                                                                    'list_item',
                                                                children: [
                                                                    {
                                                                        type:
                                                                            'ul_list',
                                                                        children: [
                                                                            {
                                                                                type:
                                                                                    'list_item',
                                                                                children: [
                                                                                    {
                                                                                        type:
                                                                                            'paragraph',
                                                                                        children: [
                                                                                            {
                                                                                                text:
                                                                                                    'Complicated list item',
                                                                                            },
                                                                                        ],
                                                                                    },
                                                                                ],
                                                                            },
                                                                        ],
                                                                    },
                                                                ],
                                                            },
                                                        ],
                                                    },
                                                ],
                                            },
                                        ],
                                    },
                                ],
                            },
                        ],
                    },
                ],
            },
        ],
    },
];
