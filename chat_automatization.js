let s_name_platform__openai = 'openai'
let s_name_platform__anthropic = 'anthropic'

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
    // when the response is generating the button will not be in the dom therefore we can wait for the button 
    // when the button is there the response will be done
    let o_btn_stop = await f_o__element_last_from_selector("[aria-label='Stop generating']");
    let o_btn_send2 = await f_o__element_last_from_selector("[data-testid='send-button']");
    await f_sleep_n_ms(Math.random()*1111+1111)

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

// let a_s = a_o.map(o=>o.s_prompt)
let a_s = [
    ...[
        "A traditional Japanese tea ceremony takes place in a serene garden setting, with participants dressed in elegant kimonos.",
        "An artist meticulously paints a detailed landscape, capturing the essence of a tranquil countryside scene on canvas.",
        "A family of elephants frolics in a lush savanna, their graceful movements reflecting the harmony of wildlife in their natural habitat.",
        "A charming cobblestone street winds through a picturesque European village, lined with quaint cafes and colorful flower boxes.",
    
        // "A cozy cabin nestled in a snowy forest glows warmly in the moonlight, offering a peaceful retreat from the wintry wilderness.",
        // "A cascading waterfall tumbles down a rocky cliff into a crystal-clear pool below, surrounded by lush greenery and vibrant wildflowers.",
        // "A tranquil countryside meadow blooms with a colorful array of wildflowers, as butterflies flutter amidst the vibrant blossoms.",
        // "A winding river cuts through a rugged canyon, its crystal-clear waters reflecting the towering cliffs that rise on either side.",    
    ].map(
        s=>{
            return new Array(10).fill(0).map(n=>{
                return s
            })
        }
    ).flat()
]
for(let s of a_s){ 
    await f_sleep_n_ms(1000)
    await f_o_response__from_s_input(
        s_name_platform__openai, 
        `Generate an image: ${s}, random seed ${new Date().getTime()}`
    )
}
// // await f_a_s_prompt_for_image_generator_ai();

// let n = 0;
// while(n < 40){
//     n+=1
//     await f_sleep_n_ms(1000)
//     await f_o_response__from_s_input(
//         s_name_platform__openai,
//         `Generate an image: An astronaut on a horse - seed ${new Date().getTime()}`
//         )
// }
// let n = 0;
// let n_max = 1000;
// let s_name_prop = 's_description_text'
// window.a_s = ["An astronaut on a horse."]
// while(n < n_max){
//     n+=1
//     await f_sleep_n_ms(1000)
//     let o =  await f_o_response__from_s_input(
//         s_name_platform__openai,
//         `
// Generat a short text that describes an image. Give the answer as a JSON object, where the property ${s_name_prop} contains the description text. The description text be different than any of theese last descriptions:
// ${a_s.join('\n')}`
//         );
//         // console.log(o)
//         a_s.push(o.v_a_v_code_jsonparsed?.[0]?.[s_name_prop])
//         // a_s.push(o)
//         console.log(
//             {
//                 'window.a_s': window.a_s
//             }
//         )
//     }