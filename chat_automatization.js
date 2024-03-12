let s_name_platform__openai = 'openai'
let s_name_platform__anthropic = 'anthropic'
let s_name_platform__gemini = 'gemini'

let f_b_generating = function(
    s_name_platform = s_name_platform__openai
){
    if(s_name_platform == s_name_platform__openai){
        
        let o_btn_stop = document.querySelector("[aria-label='Stop generating']");
        let o_btn_send = document.querySelector("[data-testid='send-button']");
        return o_btn_stop && !o_btn_send;  
        // let o_btn_send2 = await f_o__element_last_from_selector("[data-testid='send-button']");
    }
    if(s_name_platform == s_name_platform__anthropic){
        return document.querySelector(`[data-testid="run-button"]`)?.getAttribute('disabled') == '';
    }
    if(s_name_platform == s_name_platform__gemini){
        let o_btn = document.querySelector(`[aria-label="Send message"]`);
        let o_stop_svg = o_btn.querySelector('svg');
        let o_animated_line = document.querySelector('.animated-line-inner');
        if(o_animated_line || o_stop_svg){
            return true
        }
        return false
    }
}
let f_execute_send_prompt = async function(   
    s_name_platform = s_name_platform__openai, 
){

    if(s_name_platform == s_name_platform__openai){
        let o_btn = await f_o__element_last_from_selector("[data-testid='send-button']");
        o_btn.click()
        await f_sleep_n_ms(Math.random()*111+111)
        return true
    }
    if(s_name_platform == s_name_platform__anthropic){
        let o_btn = await f_o__element_last_from_selector(`[data-testid="run-button"]`);
        await f_sleep_n_ms(Math.random()*111+111)
        o_btn.click();
        return true
    }
    if(s_name_platform == s_name_platform__gemini){
        let o_btn = await f_o__element_last_from_selector(`[aria-label="Send message"]`);
        o_btn.click()
    }
}
let f_o_response__last = async function(
    s_name_platform = s_name_platform__openai, 

){
    class O_response{
        constructor(
            v_a_s_text,
            v_a_s_code,
            v_a_s_url_img,
            v_a_v_text_jsonparsed,
            v_a_v_code_jsonparsed,
        ){
            this.v_a_s_text = v_a_s_text
            this.v_a_s_code = v_a_s_code
            this.v_a_s_url_img = v_a_s_url_img
            this.v_a_v_text_jsonparsed = v_a_v_text_jsonparsed
            this.v_a_v_code_jsonparsed = v_a_v_code_jsonparsed
        }
    }
    let o_response = null;
    if(s_name_platform == s_name_platform__openai){

        // when the response is generating the button will not be in the dom therefore we can wait for the button 
        // when the button is there the response will be done
        let o_btn_stop = await f_o__element_last_from_selector("[aria-label='Stop generating']");
        let o_btn_send2 = await f_o__element_last_from_selector("[data-testid='send-button']");
        await f_sleep_n_ms(Math.random()*1111+1111)
        
        let o = await f_o__element_last_from_selector('.agent-turn'); 
        let o2 = null;
        while(!o2){
            o2 = Array.from(o?.querySelectorAll('button'))?.find(o=>o.className.includes('[.final-completion]'));
            console.log(o2);
            await f_sleep_n_ms(1000);
        }
    
        let v_s_text = o?.querySelector('p')?.innerText
        let v_s_code = o?.querySelector('code')?.innerText
        let v_s_url_img = o?.querySelector('img')?.src

        o_response = new O_response(
            [v_s_text],
        [v_s_code],
        [v_s_url_img],
        )
    }
    if(s_name_platform == s_name_platform__anthropic){
        let o = await f_o__element_last_from_selector('.contents');
        let b = false;
        while(!b){
            b = await !f_b_generating(s_name_platform);
            console.log('waiting for ai to finish generating')
            await f_sleep_n_ms(1000);
        }
        let v_a_s_text = Array.from(o.querySelectorAll('p')).map(o=>o.innerText);
        let v_s_text = o.innerText

        o_response = new O_response(
            v_a_s_text,
        [],
        [],
        )
    }
    if(s_name_platform == s_name_platform__gemini){
        var o_el_resp = await f_o__element_last_from_selector('.response-content');
        let a_o_el =  o_el_resp?.querySelectorAll('.code-block');
        if(!a_o_el){
            a_o_el = []
        }
        var a_o_el_code = Array.from(a_o_el)
        var a_o_el_codecont = a_o_el_code?.map(o=>o.querySelector('.code-container'))
        
        o_response = new O_response(
            [o_el_resp.innerText],
            [a_o_el_codecont.map(o=>o.innerText)],
            [],
        )
    }
    o_response.v_a_v_text_jsonparsed = o_response.v_a_s_text.map(
        s=>{
            try {
                return JSON.parse(s)
            } catch (error) {
                return false
            }
        }
    ).filter(v=>v)
    o_response.v_a_v_code_jsonparsed = o_response.v_a_s_code.map(
        s=>{
            try {
                return JSON.parse(s)
            } catch (error) {
                return false
            }
        }
    ).filter(v=>v)

    return o_response;

}
let f_update_prompt = async function(
    s_name_platform = s_name_platform__openai, 
    s_prompt
){

    if(s_name_platform == s_name_platform__openai){
        let o = await f_o__element_last_from_selector('#prompt-textarea'); 

        var o_ev_keyup = new Event('keyup', {bubbles: true});
        var o_ev_change = new Event('change', {bubbles: true});
        var o_ev_input = new Event('input', {bubbles: true});
    
        o.value = s_prompt

        await f_sleep_n_ms(Math.random()*100+100);
        o.dispatchEvent(o_ev_keyup);
        await f_sleep_n_ms(Math.random()*100+100);
        o.dispatchEvent(o_ev_change);
        await f_sleep_n_ms(Math.random()*100+100);
        o.dispatchEvent(o_ev_input);
    }
    if(s_name_platform == s_name_platform__anthropic){
        let o = await f_o__element_last_from_selector('.ProseMirror');
        o.textContent = s_prompt
    }
    if(s_name_platform == s_name_platform__gemini){
        document.querySelector('rich-textarea p').innerText = s_prompt
    }
}
let f_claude = async function(){
    
    window.a_s = ['People playing in the park']
    let s_name_platform = s_name_platform__anthropic
    let n_it = 0; 
    let n_its = 10;
    let s_name_prop = 's_description'
    while(n_it < n_its){
        n_it+=1;
        await f_update_prompt(
            s_name_platform,
            `
            generate a description of a picture that I can give to a painter to paint.
            Be as pictorial as possible in your descriptions. The resulting image should be similar to a "wimmelbild" picture in where is waldo.
            Return the answer as a json object where the property '${s_name_prop}' contains the prompt string. random seed ${new Date().getTime()}
            Make sure that the description is not similar to one of the following previous descriptions:
            ${a_s.join('\n')}
        `
        )
        await f_execute_send_prompt(s_name_platform);
        let o_response = await f_o_response__last(s_name_platform);
        let s_res = o_response?.v_a_v_text_jsonparsed.find(o=>o[s_name_prop])?.s_name_prop
        window.a_s = [
            ...window.a_s,
            s_res   
        ].filter(v=>v);
    }

}
let f_a_o__element_from_selector = async function(
    
    s_selector,
    o_el_parent = document,
    n_ms_wait_between = 1000
){
    let a_o = null; 
    while(!a_o || a_o.length == 0){
        a_o = Array.from(o_el_parent.querySelectorAll(s_selector));
        console.log({
            s: `trying to find elements by selector : ${s_selector}`, 
            a_o
        })
        await f_sleep_n_ms(n_ms_wait_between);
        
    }
    return a_o
}
let f_o__element_last_from_selector = async function(){
    return (await f_a_o__element_from_selector(...arguments)).at(-1)
}
let f_sleep_n_ms = async (n_ms)=>{
    return new Promise((f_res)=>{
        setTimeout(()=>{return f_res(true)},n_ms)
    })
}


let f_o_response__from_s_input = async function(
    s_name_platform,
    s_input
){

    await f_update_prompt(s_name_platform, s_input);
    await f_execute_send_prompt(s_name_platform);
    await f_sleep_n_ms(Math.random()*111+111)


    let o_resp = await f_o_response__last(s_name_platform);
    return o_resp
}

let s = 'create a short textprompt for a image generator ai that i can use later. when i use this textprompt, the resulting image should be a image depicting dozens or more people doing a variety of amusing things in the style of "where is waldo" / "where is wally", give the response as a json format where the property "prompt" contains the string'



let f_question_answer_game = async function(
    s_question__genesis = 'Why are cats so furry?',
    n_iterations = 10, 
){
    
    let f_s_prompt_from_s_question = function(s){
        return `give a reponse as json format containing the property "s_question", the string should include a new question that challanges the answer, also inside the "s_answer" there should be the answer string to the following current question: ${s}`
    }
    window.o = await f_o_response__from_s_input(f_s_prompt_from_s_question(s_question__genesis));
    
    let n_it = 0; 
    let n_its = 10;
    let a_o = []
    a_o.push(o);
    while(n_it < n_its){
        n_it+=1;
        console.log(o);
        let s_question = (JSON.parse(o?.v_s_code))?.s_question;
        if(!s_question){
            break;
        }
        o = await f_o_response__from_s_input(f_s_prompt_from_s_question(s_question));
        a_o.push(o);
    }
    let a_o2 = 
        a_o.map(o=>{
            let o2 = (JSON.parse(o?.v_s_code))
            return o2
        })
    console.log(a_o2)
    // let o2  = JSON.parse(await f_o_response__from_s_input(o?.v_s_code));
    // console.log(o2?.teststring)
}
// f_question_answer_game('Why are cats so furry?', 5)




let f_a_s_prompt_for_image_generator_ai = async function(
    s_prompt__genesis = null,
    s_prompt__differentiation = null,
    s_prompt__last = null,
    n_iterations = 10, 
){
    let s_name_prop = 's_description'
    let a_a_s_genesis_s_diff_s_last = [
        [
            `create a textprompt which i later can use for an image generator ai. the resulting image should be a 'wimmelbild' similar to the where's waldo images. the prompt has to be in a descriptive way, so the text should be as descriptive as possible. Give the answer in a json object where the property '${s_name_prop}' contains the string.`,
            `Make sure the prompt is not similar to this previous prompt:`, 
            `An image showing a market full of people.`,
        ],
        [
            `generate a description of a picture that I can give to a painter to paint. Be as pictorial as possible in your descriptions. The resulting image should be similar to a "wimmelbild" picture in where is waldo. Return the answer as a json object where the property '${s_name_prop}' contains the prompt string.`,
            `make sure that the description doesn't seem similar to the one before:`, 
            `An image showing a market full of people.`,
        ],
        [
            `Erstelle eine beschreibung für ein bild in deutscher sprache. Das bild soll ein sogenanntes 'wimmelbild' sein wo viele leute zu sehen sind die jeweils einer beschäftigung nachgehen. gebe mir die antwort in einem JSON objekt zurueck wobei der string in dem attribute "${s_name_prop}" gespeichert ist.`,
            `Make sicher dass die beschreibung keiner der folgenden vorherigen beschreibungen ähnelt:`, 
            [
                {
                    "s": "Ein farbenfrohes Festival in einem weitläufigen Park, umrahmt von üppigem Grün und blühenden Gärten, bildet die Kulisse für dieses Wimmelbild. Menschenmengen schlendern zwischen Marktständen, die Kunsthandwerk, lokale Delikatessen und exotische Gewürze feilbieten. Kinder jagen begeistert Seifenblasen, während Straßenmusiker mit Gitarren und Trommeln für eine lebhafte Stimmung sorgen. Eine Gruppe von Freunden breitet ein Picknick auf dem Rasen aus, umgeben von Spielern, die Frisbee oder Fußball spielen. In der Nähe führt eine Theatergruppe in farbenfrohen Kostümen eine Aufführung unter freiem Himmel vor, die von einer faszinierten Menge umgeben ist. Ein Paar macht einen Spaziergang entlang eines Blumenwegs, der zum See führt, wo einige Leute in Ruderbooten das Wasser genießen. Ein Kunstworkshop zieht Menschen aller Altersgruppen an, die gemeinsam an einem großen Wandbild malen. Die Atmosphäre ist erfüllt von Lachen, Gesprächen und der Freude des Zusammenseins, was ein lebendiges Bild des Gemeinschaftsgefühls und der Feier des Augenblicks zeichnet."
                },
                {
                    "s": "Eine verschneite Winterlandschaft verwandelt einen städtischen Platz in ein zauberhaftes Wimmelbild voller Aktivität und Vergnügen. Familien und Freunde, dick eingepackt in bunte Schals und Mützen, genießen die Freuden des Winters. Im Zentrum lockt eine große Eislaufbahn Schlittschuhläufer aller Altersklassen, die geschickt ihre Runden drehen oder vorsichtig ihre ersten Schritte auf dem Eis wagen. An einer Ecke des Platzes steht ein kleiner Weihnachtsmarkt, an dem Händler heißes Kakao, gebrannte Mandeln und traditionelle Handwerkskunst anbieten. Kinder bauen einen Schneemann in der Nähe, sorgfältig einen Karottennase platzierend und mit Kohlestücken für die Augen. Ein improvisierter Chor singt Weihnachtslieder, begleitet von einem Akkordeonspieler, während Zuhörer innehalten, um zuzuhören und mitzusingen, ihre Atemwolken vermischen sich mit der kalten Luft. In der Ferne ziehen Pferdeschlitten ihre Bahnen, angezogen von festlich geschmückten Pferden. Das Bild fängt die Magie und den Geist der Wintersaison ein, ein lebhaftes Fest der Gemeinschaft und der traditionellen Winterfreuden."
                },
                {
                    "s": "Eine lebendige Küstenstadt wird in diesem Wimmelbild zum Schauplatz eines sommerlichen Straßenfestes. An der Uferpromenade reihen sich bunt geschmückte Stände aneinander, die frische Meeresfrüchte, handgemachtes Eis und kühle Getränke anbieten. Gruppen von Menschen schlendern entlang des Strandes, wo einige mutige Surfer die Wellen bezwingen und Kinder in der Brandung spielen. Künstler mit ihren Staffeleien fangen die Szenerie in lebhaften Farben ein, während Straßenmusiker mit Meeresrauschen im Hintergrund für eine entspannte Atmosphäre sorgen. In einer kleinen Bucht veranstalten Einheimische ein Drachenbootrennen, das mit Begeisterung von Zuschauern am Ufer verfolgt wird. Ein nahegelegener Spielplatz ist gefüllt mit dem Kichern und Jauchzen von Kindern, die auf Schaukeln und Rutschen spielen. Im Hintergrund der Szene erheben sich malerische Klippen, von denen aus Spaziergänger den atemberaubenden Ausblick auf das Meer genießen. Das Bild fängt die unbeschwerte Freude des Sommers ein, mit einer Gemeinschaft, die sich versammelt, um das schöne Wetter, die Kultur und die Freuden des Küstenlebens zu feiern."
                },
                {
                    "s": "Inmitten einer historischen Altstadt entfaltet sich ein lebhaftes Straßenfest auf dem Wimmelbild, wo kopfsteingepflasterte Gassen von farbenfrohen mittelalterlichen Gebäuden gesäumt werden. Handwerker und Händler bieten in ihren traditionellen Gewändern handgefertigte Waren, von Schmuck bis hin zu Holzspielzeug, in ihren Ständen an. Eine Gruppe von Gauklern unterhält die Menge mit akrobatischen Kunststücken und Feuerspucken, während ein Narr die Kinder mit seinen Scherzen und Zaubertricks zum Lachen bringt. In einer Ecke des Platzes findet ein kleiner Ritterturnier-Nachbau statt, wo Kinder in Holzrüstungen mit viel Enthusiasmus gegeneinander antreten. Am Rand des Festes bieten Bäcker frisches Brot und andere Leckereien aus einem Steinofen an, während in der Nähe eine Band von Musikern mit Lauten und Flöten für eine musikalische Zeitreise ins Mittelalter sorgt. An einem Brunnen versammeln sich Menschen, um frisches Wasser zu holen oder einfach nur die Handwerkskunst und das Plätschern des Wassers zu bewundern. Über allem wacht das imposante Schloss, das majestätisch über der Szenerie thront und die historische Atmosphäre der Veranstaltung vervollständigt. Das Bild vermittelt das Gefühl einer Zeitreise und das lebendige Treiben eines Festes, das Tradition und Gemeinschaft zelebriert."
                },
                {
                    "s": "Auf dem Campus einer Universität findet eine lebendige Open-Air-Buchmesse statt, die in diesem Wimmelbild festgehalten wird. Zwischen modernen und historischen Gebäuden reihen sich zahlreiche Stände, an denen Verlage und Buchhandlungen eine Vielzahl von Büchern präsentieren, von neuesten Bestsellern bis hin zu seltenen Erstausgaben. Studenten, Professoren und Bücherliebhaber aller Altersgruppen schlendern neugierig von Stand zu Stand, vertieft in Leseproben oder im Gespräch mit Autoren, die ihre Werke signieren. In einer Ecke des Platzes hält ein bekannter Schriftsteller eine Lesung für eine versammelte Menge, die gespannt auf Bänken und auf dem Rasen sitzt. Kinder nehmen an einer interaktiven Geschichtenerzählstunde teil, umgeben von farbenfrohen Illustrationen und Bücherstapeln. Ein improvisiertes Café bietet einen Ruhebereich, wo Besucher bei Kaffee und Kuchen über ihre neuesten Entdeckungen diskutieren können. Im Hintergrund führen Studententheatergruppen kurze Stücke auf, inspiriert von klassischer und zeitgenössischer Literatur, während im nahegelegenen Musikpavillon eine Jazzband für eine entspannte Atmosphäre sorgt. Dieses Bild fängt die Leidenschaft für das Lesen und die gemeinschaftliche Freude am Austausch über Literatur ein, inmitten der inspirierenden Kulisse akademischer Einrichtungen."
                }
            ].map(o=>o.s).join()
        ]
    ]
    if( s_prompt__genesis == null ||
        s_prompt__differentiation == null ||
        s_prompt__last == null ){

            s_prompt__genesis = a_a_s_genesis_s_diff_s_last.at(-1)[0]
            s_prompt__differentiation = a_a_s_genesis_s_diff_s_last.at(-1)[1]
            s_prompt__last = a_a_s_genesis_s_diff_s_last.at(-1)[2]
    }

    let f_s_prompt = function(
        s_prompt__genesis,
        s_prompt__differentiation,
        s_prompt__last
    ){
        return `
${s_prompt__genesis}
${s_prompt__differentiation}
${s_prompt__last}
        ` 
    }
    
    let n_it = 0; 
    let n_its = n_iterations;
    window.a_o = [{s: s_prompt__last}]
    while(n_it < n_its){
        n_it+=1;
        let o = await f_o_response__from_s_input(f_s_prompt(
            s_prompt__genesis,
            s_prompt__differentiation,
            a_o.map(o=>o.s).join('\n')
        ));
        let o2 = null;
        let nt = 5; 
        while(nt > 0){
            nt-=1;
            try {
                console.log(`trying to parse json from:`)
                console.log(o?.v_s_code)
                o2 = (JSON.parse(o?.v_s_code));
                if(o2){
                    break
                }
            } catch (error) {
                
            }
            await f_sleep_n_ms(1000);
        }
        let s = o2?.[s_name_prop];

        a_o.push(
            {
                s: s
            }
        )

    }


    // let o2  = JSON.parse(await f_o_response__from_s_input(o?.v_s_code));
    // console.log(o2?.teststring)
}

// f_a_s_prompt_for_image_generator_ai(
//     `Craft an evocative but short text prompt designed for utilization with an image generator AI. The ultimate output should manifest as a captivating 'wimmelbild,' reminiscent of the beloved Where's Waldo illustrations. Your prompt must exude vivid descriptiveness, painting a rich tapestry of scenes and characters. Deliver your response encapsulated within a JSON object, wherein the 's_prompt' property encapsulates the beautifully articulated text`
// );


let f_a_o__from_a_s_prompt__considering_cap_limit = async function(a_s_prompt){
    let n_cap_messages_per_hour = parseInt(40/3);//40messages per 3 hours
    let n_ms_waittime_between_message = (1000*60*60)/n_cap_messages_per_hour;
    window.a_o = [];
    for(let s of a_s_prompt){
        console.log(
            {
                'window.a_o': window.a_o
            }
        )
        window.a_o.push(
            {
                s_prompt: s,
                o_response: await f_o_response__from_s_input(s)
            }
        )
        let o_date = new Date()
        let o_date_next = new Date(o_date.getTime()+n_ms_waittime_between_message);
        console.log({
            s: `there is a cap limit for messages per hour, therefore waiting until: ${o_date_next.toString()} until sending the next prompt`,
            n_cap_messages_per_hour, 
            n_ms_waittime_between_message, 
        })
        await f_sleep_n_ms(n_ms_waittime_between_message);
    }
    console.log('done')
}
// await f_a_o__from_a_s_prompt__considering_cap_limit(['give yes as an answer', 'no give noo', 'now give now', 'then five give'])
// await f_a_o__from_a_s_prompt__considering_cap_limit(
//     a_o.map(o=>o.s_prompt)
// )
// await f_a_o__from_a_s_prompt__considering_cap_limit(
//     a_s)

let f = async function(){

// let a_s = a_o.map(o=>o.s_prompt)
// let a_s = [
//     // ...[
//     //     // "A traditional Japanese tea ceremony takes place in a serene garden setting, with participants dressed in elegant kimonos.",
//     //     // "An artist meticulously paints a detailed landscape, capturing the essence of a tranquil countryside scene on canvas.",
//     //     // "A family of elephants frolics in a lush savanna, their graceful movements reflecting the harmony of wildlife in their natural habitat.",
//     //     // "A charming cobblestone street winds through a picturesque European village, lined with quaint cafes and colorful flower boxes.",
    
//     //     // "A cozy cabin nestled in a snowy forest glows warmly in the moonlight, offering a peaceful retreat from the wintry wilderness.",
//     //     // "A cascading waterfall tumbles down a rocky cliff into a crystal-clear pool below, surrounded by lush greenery and vibrant wildflowers.",
//     //     // "A tranquil countryside meadow blooms with a colorful array of wildflowers, as butterflies flutter amidst the vibrant blossoms.",
//     //     // "A winding river cuts through a rugged canyon, its crystal-clear waters reflecting the towering cliffs that rise on either side.",    
//     // ].map(
//     //     s=>{
//     //         return new Array(10).fill(0).map(n=>{
//     //             return s
//     //         })
//     //     }
//     // ).flat()
//     ...[
//         // {
//         //   "s_description_text": "A nighttime patrol unfolds: an astronaut, perched atop their horse, scans the alien landscape with a powerful searchlight. The horse, ears perked and nostrils flaring, seems attuned to the environment.  Are they patrolling for nocturnal predators, or searching for signs of alien life?"
//         // },
//         // {
//         //   "s_description_text": "A curious encounter unfolds: an astronaut, kneeling on the ground, examines the hoof of their horse. The horse patiently lifts its leg, its gaze fixed on the astronaut's visor.  Is the astronaut attending to a minor injury, or perhaps studying the horse's unique physiology for adaptation on this new world?"
//         // },
//         // {
//         //   "s_description_text": "A race against the clock unfolds: an astronaut on horseback gallops towards a colossal, half-built structure in the distance. The astronaut gestures urgently, urging their horse to greater speed.  Are they transporting vital supplies to the construction site, or perhaps racing to evacuate before an impending disaster?"
//         // },
//         // {
//         //   "s_description_text": "A lone rider explores: an astronaut, silhouetted against a backdrop of towering alien trees, sits confidently atop their horse. The horse cautiously picks its way through the dense undergrowth, its hooves barely making a sound.  Is this a scouting mission for a new colony, or a scientific expedition to study this exotic environment?"
//         // },
//         // {
//         //   "s_description_text": "A tender moment unfolds: an astronaut, helmet resting beside them, sketches their horse in a worn notebook. The horse grazes contentedly nearby, bathed in the warm glow of a binary sunset.  Is this a record of a cherished companion, or a scientific study of an unusual creature?"
//         // },
//         // {
//         //   "s_description_text": "A playful moment unfolds: an astronaut, holding a strange, bioluminescent plant, playfully dangles it in front of their horse. The horse, snorting and pawing the ground playfully, seems eager to snatch the glowing prize.  Is this a moment of levity during a long exploration, or are they testing the properties of the alien flora?"
//         // },
//         // {
//         //   "s_description_text": "A silent exchange unfolds: an astronaut, holding a strange device, extends it towards their horse. The horse, ears pricked and nostrils flared, snorts curiously at the unfamiliar object.  Is the astronaut offering a treat or attempting to communicate using alien technology?"
//         // },
//         // {
//         //   "s_description_text": "A serene partnership unfolds: an astronaut, hand outstretched, offers a strange, bioluminescent plant to their horse. The horse, bathed in the ethereal glow of the plant, lowers its head curiously to sniff the offering.  Is this a moment of trust between explorer and companion, or are they studying the potential uses of this alien flora?"
//         // },
//         // {
//         //   "s_description_text": "An unexpected hurdle: an astronaut, sprawled on the alien ground, reaches for their helmet which has tumbled a few feet away. Their horse, standing calmly nearby, whinnies softly.  Did the astronaut lose their balance, or were they spooked by something in this strange new environment?"
//         // },
//         // {
//         //   "s_description_text": "A watchful vigil: an astronaut, perched atop a rocky ridge, surveys the alien landscape through a pair of high-powered binoculars. Their horse stands patiently beside them, its head held high, ears swiveling to catch any sound. Are they searching for signs of life, or keeping watch for potential dangers in this uncharted territory?"
//         // }
//         {
//             "s_description_text": "A bustling marketplace unfolds: vendors hawk their wares under colorful awnings, while shoppers weave through the crowd. A lone figure, silhouetted against the setting sun, seems lost in thought. Are they a weary traveler, or a local resident with a hidden agenda?"
//             },
//             {
//             "s_description_text": "A solitary lighthouse stands sentinel on a rocky cliff, its powerful beam slicing through the stormy night. Enormous waves crash against the jagged rocks, sending plumes of spray high into the air.  Is this a scene of peaceful solitude or a dramatic struggle against the elements?"
//             },
//             {
//             "s_description_text": "A majestic waterfall cascades down a lush green mountainside, its water collecting in a crystal-clear pool below. Lush ferns and vibrant flowers line the rocky path leading to the falls.  Is this a haven of tranquility or a hidden entrance to a forgotten world?"
//             },
//             {
//             "s_description_text": "A vibrant coral reef teems with life: colorful fish dart between intricate coral formations, while a graceful sea turtle glides effortlessly through the crystal-clear water.  Is this a glimpse into an untouched underwater paradise or a fragile ecosystem threatened by change?"
//             },
//             {
//             "s_description_text": "A lone sailboat battles a raging storm. The wind whips at the tattered sails, and the boat heels dangerously in the churning waves. The crew, faces etched with determination, fights to keep the vessel afloat.  Will they weather the storm, or will they be swallowed by the unforgiving sea?"
//             },
//             {
//             "s_description_text": "A bustling cityscape stretches towards the horizon. Towering skyscrapers pierce the clouds, while streams of vehicles navigate the complex network of roads below.  Is this a symbol of human progress or a cautionary tale of unchecked urban sprawl?"
//             },
//             {
//             "s_description_text": "A group of archaeologists meticulously brushes away dirt from an ancient artifact. The artifact, partially buried in the sand, appears to be a weathered statue of a long-forgotten deity.  What secrets will be unearthed from the sands of time?"
//             },
//             {
//             "s_description_text": "A lone figure gazes out at a breathtaking vista of rolling hills bathed in the golden light of dawn. Mist hangs low in the valleys, and a gentle breeze rustles through the tall grass.  Is this a moment of peaceful reflection or a yearning for adventure?"
//             },
//             {
//             "s_description_text": "A bustling kitchen is a whirlwind of activity. Chefs expertly chop vegetables, stir simmering pots, and plate dishes with artistic flair. The air is filled with the aroma of delicious food.  Is this a glimpse into a world-renowned restaurant or a family preparing a home-cooked meal?"
//             },
//             {
//             "s_description_text": "A group of friends laughs and cheers as they raise their glasses in a toast. The table is laden with food and drinks, and the room is filled with festive decorations.  Is this a joyous celebration of a special occasion or a casual gathering of loved ones?"
//             },
//             {
//             "s_description_text": "A lone hiker navigates a treacherous mountain path. The path is narrow and winding, with sheer cliffs on one side and a deep valley on the other. The hiker, determined and focused, continues their ascent.  Will they reach the summit, or will the treacherous terrain prove too much?"
//             },
//             {
//             "s_description_text": "A majestic lion surveys its domain from atop a rocky outcrop. Its golden mane shimmers in the sunlight, and its powerful gaze commands respect.  Is this the king of the jungle asserting its dominance, or a solitary creature observing its surroundings?"
//             },
//             {
//             "s_description_text": "A bustling train station is a hive of activity. Passengers hurry to board their trains, while vendors hawk their wares and announcements echo through the halls.  Is this the start of an exciting journey or a return to a familiar place?"
//             },
//             {
//             "s_description_text": "A group of children play pirates on a sandy beach. They build elaborate sandcastles, brandish sticks as swords, and chase each other with shouts of delight.  Is this a carefree afternoon of make-believe or a glimpse into the future of daring explorers?"
//             },
//             {
//             "s_description_text": "A concert hall is filled with the music of a symphony orchestra. The conductor leads with passion, and the musicians play with skill and precision. The audience sits enthralled, captivated by the beautiful sounds.  Is this a night of cultural enrichment or a fleeting escape from the everyday world?"
//             },
//             {
//                 "s_description_text": "An abandoned library stands shrouded in mystery. Cobwebs drape the dusty shelves, and sunlight streams through broken windows, illuminating forgotten books.  Does this forgotten place hold hidden knowledge, or is it simply a relic of the past?"
//                 },
//                 {
//                 "s_description_text": "A lone blacksmith hammers away at a piece of glowing metal on his anvil. Sparks fly as he shapes the metal with powerful blows, his brow furrowed in concentration.  Is this a skilled craftsman at work, or an artist creating a masterpiece?"
//                 },
//                 {
//                 "s_description_text": "A bustling street market overflows with colorful fabrics, exotic spices, and handcrafted goods. Shopkeepers call out to passersby, and the air is filled with the sounds of bargaining and laughter.  Is this a cultural melting pot or a testament to the human spirit of commerce?"
//                 },
//                 {
//                 "s_description_text": "A serene yoga class unfolds in a sunlit studio. Participants lie on their mats in various poses, their eyes closed and their bodies relaxed. The instructor speaks softly, guiding them through their practice.  Is this a path to inner peace or a trendy fitness routine?"
//                 },
//                 {
//                 "s_description_text": "A group of protestors marches down a crowded street, their voices chanting slogans and their signs held high. Police officers in riot gear stand guard on the sidelines.  Is this a fight for justice or a symptom of social unrest?"
//                 },
//                 {
//                 "s_description_text": "A vintage car rally winds its way through a picturesque countryside landscape. Classic automobiles from different eras gleam in the sunlight, their engines purring contentedly.  Is this a nostalgic celebration of automotive history or a competition for passionate collectors?"
//                 },
//                 {
//                 "s_description_text": "A group of astronomers peers through a giant telescope, their eyes focused on the distant stars. The control room is filled with blinking lights and complex computer screens.  Are they searching for new worlds or unlocking the secrets of the universe?"
//                 },
//                 {
//                 "s_description_text": "A lone angler casts their line into a glassy lake at sunrise. The mist hangs low over the water, and the only sound is the gentle lapping of waves against the shore.  Is this a moment of peaceful solitude or a patient wait for the perfect catch?"
//                 },
//                 {
//                 "s_description_text": "A bustling ballet studio echoes with the sounds of leaping dancers and Tchaikovsky's Swan Lake. Young ballerinas rehearse their steps with grace and precision, striving for perfection.  Is this the start of a promising career or a dedication to a lifelong passion?"
//                 },
//                 {
//                 "s_description_text": "A bustling bakery fills the air with the aroma of freshly baked bread. Golden loaves and pastries line the shelves, tempting customers with their deliciousness.  Is this a glimpse into a traditional craft or a modern take on a timeless treat?"
//                 },
//                 {
//                 "s_description_text": "A group of rock climbers scales a sheer cliff face, their movements precise and calculated. They rely on trust and teamwork to navigate the challenging terrain.  Is this a test of physical skill or a metaphor for overcoming obstacles?"
//                 },
//                 {
//                 "s_description_text": "A bustling hospital emergency room is a scene of controlled chaos. Medical professionals work tirelessly to treat patients, their faces etched with determination.  Is this a battle against time or a testament to human compassion?"
//                 },
//                 {
//                 "s_description_text": "A blacksmith's apprentice carefully observes their master at work. They watch with fascination as the metal is shaped and transformed, eager to learn the secrets of the craft.  Is this the passing of knowledge from one generation to the next or the start of a lifelong dedication?"
//                 },
//                 {
//                 "s_description_text": "A majestic bald eagle soars through a clear blue sky, its powerful wings beating steadily. It surveys the landscape below with a keen eye, searching for prey.  Is this a symbol of freedom and power or a predator at the top of the food chain?"
//                 },
//                 {
//                 "s_description_text": "A bustling farmers market overflows with fresh produce. Local farmers showcase their best offerings, from colorful fruits and vegetables to fragrant herbs and vibrant flowers.  Is this a celebration of local agriculture or a glimpse into a sustainable way of life?"
//                 }
//     ].map(o=>{
//         return o.s_description_text
//     })
// ]
// a_s = [
//     ...'Another simple logo for my it company.|'.repeat(5).split('|'), 
//     ...'Another simple logo for my fast food joint.|'.repeat(10).split('|'), 
//     ...'Another simple logo for my neural institute.|'.repeat(10).split('|'), 
//     ...'Another simple logo for my library.|'.repeat(10).split('|'), 
// ]

let a_s = [
// "A hyperdetailed CGI illustration of a powerful eagle soaring through a vast sea of stars. Its outstretched wings are formed from wispy nebulae, trailing stardust in their wake. The eagle's head, a cluster of tightly packed stars, gazes intently at the cosmos below.",

// "A whimsical CGI scene of a playful dolphin leaping through a field of nebulae. Its sleek body is formed from a swirling pink and purple nebula, leaving a trail of shimmering stardust in its wake. Distant galaxies twinkle in the background, creating a dreamy and fantastical scene.",

// "A photorealistic CGI close-up of a vibrant butterfly formed from a nebula. The wings are a mesmerizing combination of swirling gas and dust, with hues of blue, green, and purple. Tiny stars twinkle within the nebula, creating a sense of awe and wonder at the beauty of the cosmos.",

// "A dramatic CGI scene of a colossal serpent winding its way through a field of nebulae. Its long body is formed from a dark, swirling nebula, with stars scattered like jewels throughout. The serpent's eyes glow with an eerie light, adding to the fantastical atmosphere.",

// "A fantastical CGI illustration of a wise owl perched on a cosmic cloud. Its body is a swirling nebula with deep blue and purple hues, and its large eyes are formed from clusters of bright stars. The owl gazes intently at the universe below, radiating an air of knowledge and mystery.",

// "A photorealistic CGI scene of a majestic dragon soaring through a nebula. Its body is a fiery red nebula, with wings formed from swirling gas and dust. The dragon's eyes glow with an intense orange light, and its powerful roar echoes through the cosmos.",

// "A hyperdetailed CGI illustration of a delicate spider web woven across a nebula. The web is formed from shimmering stardust, connecting various clusters of stars that represent the spider's intricate legs. The center of the web glows with a faint light, hinting at the hidden spider within.",

// "A whimsical CGI scene of a playful crab scuttling across a bed of nebulae. Its shell is a swirling blue and green nebula, with pincers formed from stardust. Tiny galaxies twinkle in the background, adding to the fantastical scenery.",
...["Lion", "Elephant", "Tiger", "Zebra", "Giraffe", "Cheetah", "Gorilla", "Chimpanzee", "Kangaroo", "Koala",
"Panda", "Hippopotamus", "Rhinoceros", "Whale", "Dolphin", "Shark", "Sea Turtle", "Octopus", "Eagle",
"Hawk", "Owl", "Parrot", "Peacock", "Hummingbird", "Snake", "Spider", "Butterfly", "Bee", "Ant", "Crab"].map(s=>{
    return `A breathtaking astrophotography of a mystical ${s} formed entirely from celestial nebulae.
    The swirling gas clouds define the animal's powerful form, with vibrant colors like blues, purples, and pinks highlighting its features.
    Starlight peeks through the nebulae, adding depth and a sense of awe to this fantastical creature. 
    Imagine the image captured with a powerful telescope, revealing the intricate details of the nebulae that form the animal's body, 
    deep sky, nebula, star cluster, galaxy, wide field, long exposure, hydrogen alpha, emission nebula, reflection nebula, planetary nebula, supernova remnant, cosmic dust, dark nebula, light pollution filter, equatorial mount, astrophotography camera, telescope, astrophotographer`

})
]
for(let s of a_s){ 
    await f_sleep_n_ms(1000)
    await f_o_response__from_s_input(
        s_name_platform__openai, 
        `Generate an image: ${s}`
    )
}}
f()
// await f_a_s_prompt_for_image_generator_ai();

// let n = 0;
// while(n < 40){
//     n+=1
//     await f_sleep_n_ms(1000)
//     await f_o_response__from_s_input(
//         s_name_platform_tmp,
//         `Generate an image: An astronaut on a horse - seed ${new Date().getTime()}`
//         )
// }\
// let s_name_platform_tmp = s_name_platform__gemini


// let f = async function(){

//     let n = 0;
//     let n_max = 1000;
//     let s_name_prop = 's_description_text'
//     window.a_s = ["An astronaut on a horse."]
//     while(n < n_max){
//         n+=1
//         await f_sleep_n_ms(1000)
//         let o =  await f_o_response__from_s_input(
//             s_name_platform_tmp,
//             `
//     Generat a short text that describes an image. Give the answer as a JSON object, where the property ${s_name_prop} contains the description text. The description text be different than any of theese last descriptions:
//     ${a_s.join('\n')}`
//             );
//             // console.log(o)
//             a_s.push(o.v_a_v_code_jsonparsed?.[0]?.[s_name_prop])
//             // a_s.push(o)
//             console.log(
//                 {
//                     'window.a_s': window.a_s
//                 }
//             )
//         }   
// }
// await f()