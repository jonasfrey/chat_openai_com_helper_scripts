let f_a_o__element_from_selector = async function(
    s_selector,
    o_el_parent = document,
    n_ms_wait_between = 1000
){
    let a_o = null; 
    while(!a_o){
        a_o = Array.from(o_el_parent.querySelectorAll(s_selector));
        console.log({
            s: `trying to find elements by selector : ${s_selector}`, 
            a_o
        })
        if(!a_o){
            await f_sleep_n_ms(n_ms_wait_between);
        }
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
let f_o_response__last = async function(){
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
    return {
        v_s_text, 
        v_s_code, 
        v_s_url_img
    }
}

let f_o_response__from_s_input = async function(
    s_input
){
    let o = await f_o__element_last_from_selector('#prompt-textarea'); 

    var o_ev_keyup = new Event('keyup', {bubbles: true});
    var o_ev_change = new Event('change', {bubbles: true});
    var o_ev_input = new Event('input', {bubbles: true});

    o.value = s_input

    await f_sleep_n_ms(Math.random()*100+100);
    o.dispatchEvent(o_ev_keyup);
    await f_sleep_n_ms(Math.random()*100+100);
    o.dispatchEvent(o_ev_change);
    await f_sleep_n_ms(Math.random()*100+100);
    o.dispatchEvent(o_ev_input);

    let v_o_btn = false;
    let o_btn = await f_o__element_last_from_selector("[data-testid='send-button']");
    o_btn.click()
    await f_sleep_n_ms(Math.random()*111+111)
    // when the response is generating the button will not be in the dom therefore we can wait for the button 
    // when the button is there the response will be done
    let o_btn_stop = await f_o__element_last_from_selector("[aria-label='Stop generating']");
    let o_btn_send2 = await f_o__element_last_from_selector("[data-testid='send-button']");

    await f_sleep_n_ms(Math.random()*111+111)

    let o_resp = await f_o_response__last();
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
    s_prompt__genesis = `create a textprompt which i later can use for an image generator ai. the resulting image should be a 'wimmelbild' similar to the where's waldo images. the prompt has to be in a descriptive way, so the text should be as descriptive as possible. Give the answer in a json object where the property 's_prompt' contains the string.`,
    s_prompt__differentiation = `Make sure the prompt is not similar to this previous prompt:`, 
    s_prompt__last = `An image showing a market full of people.`,
    n_iterations = 100, 
){
    
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
    window.o = await f_o_response__from_s_input(f_s_prompt(
        s_prompt__genesis,
        s_prompt__differentiation,
        s_prompt__last
    ));
    
    let n_it = 0; 
    let n_its = n_iterations;
    window.a_o = []
    a_o.push(o);
    while(n_it < n_its){


        n_it+=1;
        let o2 = (JSON.parse(o?.v_s_code))
        let s_prompt = o2?.s_prompt;
        if(!s_prompt){
            break;
        }
        o = await f_o_response__from_s_input(f_s_prompt(
            s_prompt__genesis,
            s_prompt__differentiation,
            s_prompt
        ));
        a_o.push(o);

        window.a_o2 = a_o.map(o=>{
            let o2 = (JSON.parse(o?.v_s_code))
            return o2
        })
        console.log(a_o2)
    }

    console.log({
        a_o2
    })
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