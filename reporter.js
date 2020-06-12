// Reporter
// Last Updated: 2019-08-16
// A script to deal and take cards to selected users from specified decks.
// Syntax is !deal --[give,take] [number of cards as integer] --[deck name]
on('ready', () => {
    const version = '0.0.4';
    log('-=> Reporter v' + version + ' <=-');

    on('chat:message', (msg) => {
        //       if ('api' === msg.type && /!report(c|t)\b/i.test(msg.content) && msg.selected) {
        if ('api' === msg.type && /!report(|-token|-character)\b/i.test(msg.content) && msg.selected) {
            //        log(msg);
            //get parameter and use default of 'give' if parameter is missing or malformed
            const args = msg.content.split(/\s+--/);
            let target = (args[0] === '!report-token') ? 'token' : 'character';
            let idList = [];
            let nameList = []



            //            let token = []
            //            let character = []
            //log('failure first' + args[0]);
            //log('length of args ' + args.length);
            //let d = []


            let TCData = msg.selected
                .map(o => getObj('graphic', o._id))
                .filter(o => undefined !== o)
                .filter(t => t.get('represents').length)
                .map(t => ({
                    token: t,
                    character: getObj('character', t.get('represents'))
                }))
                .filter(o => undefined !== o.character);




            let attribute = args[1].split(/\s+/)[0];
            let attributeValue = '';
            let npcattributeValue = '';
            let attributeList = [];



            log(target);

            if (target === 'token') {
                idList = TCData.map(d => d.token.get('_id'));
                nameList = TCData.map(n => n.token.get('name'));
                let tokenChatAttributes = ['token_id', 'token_name', 'bar1', 'bar2', 'bar3', 'bar1|max', 'bar2|max', 'bar3|max'];
                let tokenAPIAttributes = ['_id', 'name', 'bar1_value', 'bar2_value', 'bar3_value', 'bar1_max', 'bar2_max', 'bar3_max'];
                if (tokenChatAttributes.includes(attribute)) {
                    substitution = tokenAPIAttributes[tokenChatAttributes.indexOf(attribute)];
                    attribute = substitution;
                }
                log(attribute);

                valueList = TCData.map(n => n.token.get(attribute));

            } else {
                idList = TCData.map(d => d.character.get('_id'));
                nameList = TCData.map(n => n.character.get('name'));

            }




            let lines = '';
            let header = "<div style='width: 100%; color: #000; border: 1px solid #000; background-color: #fff; box-shadow: 0 0 3px #000; display: block; padding-left:5px; text-align: left; font-size: 13px; padding: 5px 0; margin-bottom: 0.25em; font-family: sans-serif; white-space: pre-wrap;'> <b>Report for " + attribute + "</b>&#10;<ul>";
            let divider = "<div style='border: none; border-top-color: transparent; border-top-style: solid; border-top-width: 0.25em; border-right-color: initial; border-right-style: none; border-right-width: initial; border-bottom-color: transparent; border-bottom-style: solid; border-bottom-width: 0.25em; border-left-color: rgb(126, 45, 64); border-left-style: solid; border-left-width: 14em; border-image-source: initial; border-image-slice: initial; border-image-width: initial; border-image-outset: initial; border-image-repeat: initial; border-top: 0.25em solid transparent; border-top-width: 0.25em; border-top-style: solid; border-top-color: transparent; border-bottom: 0.25em solid transparent; border-bottom-width: 0.25em; border-bottom-style: solid; border-bottom-color: transparent; border-left: 14em solid rgb(126, 45, 64); border-left-width: 14em; border-left-style: solid; border-left-color: rgb(126, 45, 64)'</div>";
            let footer = '</div>';

            // + tokenName + "</div>"
            //        let lines = '';
            var i = 0;




            do {
                //                token[i] = getObj(msg.selected[i]._type, msg.selected[i]._id);

                if (target === 'token') {
                    lines = lines + '<li>' + nameList[i] + ' = ' + valueList[i] + '</li>';

                } else {
                    attributeValue = getAttrByName(idList[i], attribute);
                    if (attributeValue) {
                        //                        charecter = getObj("character", idList[i].get('represents'));
                        lines = lines + '<li>' + nameList[i] + ' = ' + getAttrByName(idList[i], attribute) + '</li>';
                        log(lines);
                    } else {
                        npcattributeValue = getAttrByName(idList[i], 'npc_' + attribute);
                        log('npcattributeValue = ' + npcattributeValue);
                        if (npcattributeValue) {
                            lines = lines + '<li>' + nameList[i] + ' = ' + npcattributeValue + '</li>';
                        } else {
                            lines = lines + '<li>' + nameList[i] + ' = <i>---</i></li>';
                        }
                    }
                }
                i++;
            }

            while (i < msg.selected.length);




            lines = lines + "</ul>";
            if (lines.includes('---')) {
                lines = lines + "<i></hr>Caracters who list '---' may be NPCs or characters who otherwise lack that attribute</i>";
            }
            lines = header + lines + footer;
            if (lines) {
                sendChat('Reporter', '/w gm ' + lines);

            }
        }
    });
});
