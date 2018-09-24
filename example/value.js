/** @jsx h */
// eslint-disable-next-line import/no-extraneous-dependencies
import { createHyperscript } from 'slate-hyperscript';

const h = createHyperscript({
    blocks: {
        heading: 'heading',
        paragraph: 'paragraph',
        ul_list: 'ul_list',
        ol_list: 'ol_list',
        list_item: 'list_item'
    }
});

export default (
    <value>
        <document>
            <ul_list>
                <list_item>
                    <paragraph>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</paragraph>
                </list_item>
                <list_item>
                    <paragraph>Nulla a risus mauris.</paragraph>
                    <ul_list>
                        <list_item>
                            <paragraph>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</paragraph>
                        </list_item>
                        <list_item>
                            <paragraph>Nulla a risus mauris.</paragraph>
                            <ul_list>
                                <list_item>
                                    <paragraph>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</paragraph>
                                </list_item>
                                <list_item>
                                    <paragraph>Nulla a risus mauris.</paragraph>
                                </list_item>
                                <list_item>
                                    <paragraph>Vestibulum ut felis ut augue maximus varius a sit amet ex.</paragraph>
                                </list_item>
                            </ul_list>
                        </list_item>
                        <list_item>
                            <paragraph>Vestibulum ut felis ut augue maximus varius a sit amet ex.</paragraph>
                        </list_item>
                    </ul_list>
                </list_item>
                <list_item>
                    <paragraph>Vestibulum ut felis ut augue maximus varius a sit amet ex.</paragraph>
                </list_item>
                <list_item>
                    <paragraph>Vestibulum elementum augue et ipsum aliquam, ut dignissim erat lacinia.Maecenas tempor blandit elit, vel mattis nulla.</paragraph>
                    <ol_list>
                        <list_item>
                            <paragraph>Phasellus lectus mauris, lacinia at eros quis, viverra vestibulum augue.</paragraph>
                        </list_item>
                        <list_item>
                            <paragraph>
                                Donec nec justo eu risus aliquet ullamcorper sit amet sodales tellus.
                            </paragraph>
                        </list_item>
                    </ol_list>
                </list_item>
                <list_item>
                    <paragraph>
                        Donec nec justo eu risus aliquet ullamcorper sit amet sodales tellus.
                    </paragraph>
                </list_item>
            </ul_list>
        </document>
    </value>
);
