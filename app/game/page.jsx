'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { createBrowserClient } from '@supabase/ssr'

const supabase = (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
  ? createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
  : null

/* ═══════════════════════════════════════════════════════════════
   DON'T CLOSE. TRANSFORM. — The College Survival Game
   ═══════════════════════════════════════════════════════════════ */

const ROLES = [
  { id: 'president', title: 'President', desc: 'You answer to the board. You manage the faculty. You own the vision — and the blame.', icon: '🎓' },
  { id: 'chair', title: 'Board Chair', desc: 'You answer to the donors, the accreditor, and 94 years of history. The president reports to you.', icon: '🪑' },
  { id: 'dean', title: 'Academic Dean', desc: 'You manage the faculty, the curriculum, and the quality of what students actually learn. You see what the president doesn\'t.', icon: '📋' },
  { id: 'faculty', title: 'Faculty Member', desc: 'You\'ve been here 18 years. You teach, you advise, you coach. You know the students by name. You have no power — and you see everything.', icon: '👩‍🏫' },
]

const INITIAL = {
  semester: 0,
  enrollment: 820,
  firstYear: 180,
  discountRate: 52,
  netTuition: 14200000,
  deficit: -1800000,
  endowment: 18000000,
  deferred: 14000000,
  debt: 12000000,
  faculty: 48,
  morale: 65,
  communityTrust: 70,
  donorConfidence: 60,
  boardUnity: 55,
  accreditationStanding: 'good',
  outcome: null,
  events: [],
  people: {
    cfo: { name: 'Patricia Chen', status: 'here', mood: 'exhausted' },
    provost: { name: 'Dr. James Washington', status: 'here', mood: 'frustrated' },
    facilities: { name: 'Ray Kowalski', status: 'here', mood: 'scared' },
    enrollmentVP: { name: 'Diana Santos', status: 'here', mood: 'overwhelmed' },
    topDonor: { name: 'Arthur Hartwell', status: 'engaged', mood: 'skeptical' },
    facultyLeader: { name: 'Dr. Sarah Okonkwo', status: 'here', mood: 'angry' },
    townMayor: { name: 'Janet Novak', status: 'distant', mood: 'worried' },
  }
}

const FACULTY_SEMESTERS = [
  {
    label: 'Fall — Year 1',
    narration: 'You\'ve been teaching biology here for 18 years. You run the greenhouse. You know every student by name. This semester, something feels different.',
    event: 'Enrollment is down again — your Intro Bio class has 22 students instead of the usual 40. Two sections were merged. The adjunct who taught the other section wasn\'t renewed. She cried in the hallway. Nobody from administration said a word about it.\n\nThe new president held an all-faculty meeting. She talked about "strategic priorities" and "right-sizing." You\'ve heard this language before. Your colleague in the history department got an offer from a state school and is thinking about taking it. Your partner asks you at dinner: "Should you be looking too?"\n\nMeanwhile: you notice the greenhouse is empty most afternoons. A community garden group asked the college last year about using it — nobody responded. A student in your class mentions her mother is a CNA and the hospital can\'t hire enough of them. And you see a LinkedIn post from a professor at a college in Vermont who\'s redesigning her courses around community-based learning instead of traditional lectures.',
    choices: [
      {
        text: 'Update your CV and start quietly applying to other schools. You have a family to think about.',
        effects: { morale: -5, faculty: 0 },
        reaction: 'You send out six applications over the weekend. It feels disloyal and necessary at the same time. You get a phone interview at a community college three hours away. The salary is lower. The commute would mean selling the house. Your daughter is a junior in high school. At night you stare at the ceiling and wonder how it came to this — you gave 18 years to this place. In the morning you go back to class and teach Intro Bio like nothing is wrong. The students don\'t know. They just see Professor Sharma, same as always.',
        peopleChanges: {}
      },
      {
        text: 'Keep your head down. Teach your classes. Don\'t get involved in the politics. Wait and see what happens.',
        effects: { morale: -10 },
        reaction: 'You teach. You grade. You hold office hours that fewer and fewer students attend. The faculty lounge conversations grow darker — who\'s leaving, who got an offer, who heard a rumor about program cuts. You don\'t join in, but you listen. At the end of the semester, you realize you haven\'t proposed a single new idea in two years. You used to be the person who started things. Now you\'re the person who\'s waiting for someone else to.',
        peopleChanges: {}
      },
      {
        text: 'Go to the president. Tell her what you see from the faculty perspective — the fear, the silence, the talent that\'s about to walk out the door. Offer to help.',
        effects: { morale: 10, boardUnity: 5, donorConfidence: 5 },
        reaction: 'Dr. Osei looks at you for a long moment. "You\'re the first faculty member who\'s come to me with something other than a complaint or a demand," she says. She tells you more than she probably should — the deficit, the bond situation, the board division. She asks if you\'d be willing to join a small working group to explore "alternative revenue models." You don\'t know what that means yet. But you said yes. When you tell your partner that night, they say: "You sound like yourself again."',
        peopleChanges: { facultyLeader: { mood: 'engaged' } }
      },
      {
        text: 'Call back the community garden group. Let them use the greenhouse on weekends. Start a conversation with the hospital about whether your bio labs could support CNA training. Do it without asking permission.',
        effects: { morale: 15, communityTrust: 10, donorConfidence: 5 },
        reaction: 'The community garden group shows up Saturday morning — eight people, mostly retirees. They\'re thrilled. They bring coffee cake. They tell their friends. Within a month, 20 people are using the greenhouse on weekends. You call the hospital\'s HR director and explain what your lab can do. She visits. She walks through the space and says: "This could work. Let me talk to my director of nursing education." You haven\'t asked the administration. You probably should. But you did something nobody else was doing — you opened a door. When Dr. Okonkwo hears about it, she doesn\'t report you. She says: "Can I bring my environmental science students into this?" Ray stops by the greenhouse that weekend, sees the community garden group, and says: "Finally. Somebody\'s using this place."',
        peopleChanges: { facultyLeader: { mood: 'leading' }, facilities: { mood: 'hopeful' } }
      },
    ]
  },
  {
    label: 'Spring — Year 1',
    narration: 'Winter was long. Three more faculty left over break. The ones who stayed are either loyal, stuck, or hoping.',
    event: 'Your history colleague took the state school job. She texted you from her new office: "I feel guilty but I couldn\'t stay." The English department is down to two people. A student asks you in office hours: "Is the school closing?" You say no. You\'re not sure you\'re telling the truth.\n\nThe president announces a "campus conversation" about the future. Faculty are skeptical — they\'ve seen these before. Nothing changes. But you hear a rumor that the board is actually considering something different this time. Dr. Washington, the provost, asks you to lunch. He looks tired.\n\nMeanwhile: the state announces $4M in training grants for healthcare and skilled trades. Your CNA contact at the hospital calls — she got approval from her director. They want to start a training cohort this fall if you can provide the space and the academic framework. A local nonprofit that works with veterans asks if the college offers anything for adults who want to finish a degree. And you read an article about a national movement to transform closing colleges into community hubs.',
    choices: [
      {
        text: 'Accept the community college interview. Go see what else is out there. You owe it to your family.',
        effects: { morale: -10, faculty: -1 },
        reaction: 'You drive three hours for the interview. The campus is bigger. The salary is $8K less. The department chair is friendly but distracted. You sit in a faculty lounge that smells like your faculty lounge. On the drive home, you pass a sign for your town and feel something tighten in your chest. You built 18 years here. Your students are here. The greenhouse is here. You don\'t take the job. But you keep the offer in your back pocket, just in case.',
        peopleChanges: {}
      },
      {
        text: 'Go to the campus conversation. Stand up and say what nobody else will say: the old model is dying, and the faculty need to be part of building what comes next — not spectators waiting for a memo.',
        effects: { morale: 20, boardUnity: 10, communityTrust: 5, donorConfidence: 10 },
        reaction: 'The room goes quiet when you stand up. You talk for three minutes. You talk about the students who ask if the school is closing. The colleagues who left. The greenhouse sitting empty. The hospital that wants to partner. The grants nobody applied for. You say: "We keep waiting for someone to save us. We are the someone." Two faculty members approach you afterward. One is crying. The provost shakes your hand and says: "I needed to hear that." The president sends you an email that night: "Can we talk tomorrow?" Arthur Hartwell, who was sitting in the back of the room as a board observer, calls the president and says: "Who was that biology professor?"',
        peopleChanges: { facultyLeader: { mood: 'leading' }, topDonor: { mood: 'engaged' }, provost: { mood: 'hopeful' } }
      },
      {
        text: 'Quietly build the CNA partnership yourself. Write the proposal. Get the hospital to sign a letter of intent. Then bring it to the provost as a done deal.',
        effects: { morale: 10, communityTrust: 15, donorConfidence: 5, deficit: 200000 },
        reaction: 'You spend three weeks writing the proposal. The hospital signs the letter of intent — they\'ll send 20 trainees per cohort, two cohorts per year, and pay $5,000 per trainee. That\'s $200K in new revenue from a program you built at your kitchen table. When you bring it to Dr. Washington, he reads it twice and says: "How did you do this?" You say: "I picked up the phone." He takes it to the president. She takes it to the board. Arthur Hartwell reads it and writes a check for $50K to equip the lab. You didn\'t ask for permission. You asked for forgiveness. And you got funded instead.',
        peopleChanges: { provost: { mood: 'impressed' }, topDonor: { mood: 'engaged' }, cfo: { mood: 'cautiously hopeful' } }
      },
      {
        text: 'Organize a faculty innovation group — five colleagues who want to design new programs that serve the community, not just traditional students. Meet weekly. Build a portfolio of ideas. Present to the administration together.',
        effects: { morale: 15, communityTrust: 10, boardUnity: 10, donorConfidence: 10, faculty: 0 },
        reaction: 'Five faculty say yes. You meet in the greenhouse on Tuesday afternoons — it feels subversive and hopeful at the same time. The group designs four pilot ideas: weekend community workshops (the English faculty leads creative writing for adults), a veterans degree-completion program (the criminal justice professor has military connections), a youth STEM camp in the science building (your idea), and a partnership with the food co-op for a nutrition and culinary basics course. You present all four to the provost and the president together. Dr. Washington says: "This is the first new idea I\'ve heard in this building in two years." The president asks: "How fast can you launch?" The answer is fall. The faculty innovation group becomes the Faculty Transformation Council. You\'re the chair. Nobody appointed you. You just started.',
        peopleChanges: { facultyLeader: { mood: 'leading' }, provost: { mood: 'energized' }, cfo: { mood: 'interested' } }
      },
    ]
  },
  {
    label: 'Fall — Year 2',
    narration: 'A year in. The decisions you made — or didn\'t — are visible now. The campus feels different. The question is whether it feels different enough.',
    event: (state) => {
      const engaged = state.morale > 60
      const leaving = state.morale < 40
      let text = ''
      if (leaving) text = 'Three more faculty left over the summer. Your department is down to you and one adjunct. The students feel the emptiness. The hallways are quieter. A junior tells you she\'s transferring because "there\'s nobody left to take classes from." You think about the community college offer again.'
      else if (engaged) text = 'Something is happening. The campus feels busier than it has in years — not with 18-year-olds, but with adults, community members, hospital trainees, kids in the after-school program. Your greenhouse is full on Saturdays. Two of your faculty colleagues have designed programs that are actually generating revenue. The provost smiles sometimes now.'
      else text = 'The campus is stable but tense. People are doing their jobs. Nobody is excited. Nobody is leaving, but nobody is building anything new either. You teach your classes, run the greenhouse, and wonder if this is what the rest of your career looks like.'
      text += '\n\nThe contractors\' association wants to run apprenticeships on campus. A board member forwarded an article about Meta\'s $115M trades academy. A former student — now a successful nurse practitioner — emails and asks: "Is there anything I can do to help? I heard things are tough." And the accreditor\'s annual report is due. What you write in it will shape how they see the institution.'
      return text
    },
    choices: [
      {
        text: 'Write an honest accreditor report. Include the new community programs and partnerships. Frame the transformation as institutional innovation, not desperation.',
        effects: { morale: 10, boardUnity: 10, donorConfidence: 15 },
        reaction: 'You work with Dr. Washington on the report for two weeks. Instead of hiding the enrollment decline, you contextualize it: "Traditional enrollment has declined, but total community served has increased by 340% through workforce partnerships, community programming, and non-credit offerings." The accreditor calls it "one of the most honest and forward-thinking reports we\'ve received." They don\'t put you on warning. They ask to visit.',
        peopleChanges: { provost: { mood: 'proud' } }
      },
      {
        text: 'Call the former student back. Start building an alumni network of people who want to help — not with checks, but with time, expertise, and connections.',
        effects: { morale: 10, communityTrust: 10, donorConfidence: 15 },
        reaction: 'Sarah, the nurse practitioner, brings four other alumni to a Saturday breakfast on campus. One runs a construction company. One is a social worker. One teaches at a high school. One manages a restaurant. They walk the campus and see the greenhouse, the community programs, the CNA trainees. The construction company owner says: "I\'ll teach a weekend carpentry class if you give me the space." The social worker says: "I\'ll run a support group for first-generation students — free." These aren\'t donors. They\'re something more valuable — people who want to show up.',
        peopleChanges: { topDonor: { mood: 'committed' }, communityTrust: 15 }
      },
      {
        text: 'Take the community college job. You\'ve given 18 years. You\'ve done more than anyone asked. It\'s time to protect yourself.',
        effects: { morale: -20, faculty: -1, communityTrust: -5 },
        reaction: 'You write a resignation letter that takes you three hours. You keep deleting the part about why. You tell your students on the last day of class. Two of them cry. Ray finds you in the parking lot and says: "You were the only one who used the greenhouse." You drive away and look in the rearview mirror at the campus getting smaller. Your partner says: "You did the right thing." You\'re not sure. You\'ll never be sure.',
        peopleChanges: { facultyLeader: { status: 'left', mood: 'gone' } }
      },
      {
        text: 'Propose to the president that you become the Director of Community Partnerships — a new role, half teaching, half building the transformation. Put your career on the line for this.',
        effects: { morale: 25, communityTrust: 20, donorConfidence: 20, boardUnity: 15, deficit: 400000 },
        reaction: 'The president looks at you for a long time. "You\'re asking me to create a position we\'ve never had, in the middle of a deficit, for a program that doesn\'t exist yet." You say: "I\'m asking you to let me build the thing that saves this place." She says yes. Your salary stays the same. Your title changes. Your office moves from the science building to the welcome center — right at the front door. The first person you call is Janet Novak. The second is the hospital. The third is the contractors\' association. By December, you\'ve signed three partnership agreements worth $380K in annual revenue. Dr. Okonkwo tells you at the holiday party: "You\'re the reason I stayed." Arthur Hartwell asks the president: "Why didn\'t we do this five years ago?"',
        peopleChanges: { topDonor: { mood: 'all in' }, facultyLeader: { mood: 'transformed' }, cfo: { mood: 'believes' }, townMayor: { status: 'ally', mood: 'champion' } }
      },
    ]
  },
  {
    label: 'Spring — Year 2',
    narration: 'The final semester. What you\'ve built — or what you\'ve lost — is about to become permanent.',
    event: (state) => {
      if (state.people.facultyLeader.status === 'left') return 'You\'re gone. The greenhouse is locked. The CNA program stalled without you. The community garden group was asked to leave. Your replacement is an adjunct who teaches four classes and doesn\'t know anyone\'s name. The college announces it will "explore strategic alternatives." Everyone knows what that means.'
      if (state.morale > 65) return 'The campus is unrecognizable from two years ago — in the best way. CNA graduates are working at the hospital. The contractors\' apprenticeship has a waiting list. The community garden fills the greenhouse every weekend. You teach three classes instead of five — the rest of your time is partnerships, community work, and designing new programs. A delegation from a struggling college in Indiana visited last week. A reporter from Pittsburgh is writing a story. The accreditor asked to send a study team. And Arthur Hartwell just told the president he\'s doubling his annual gift because "this is the only college in America that\'s actually doing something different."'
      if (state.morale > 45) return 'You\'re still here. The college is still open. Some things have changed — there are a few community programs, some new faces on campus. But the transformation is incomplete. You started something. Whether anyone finishes it depends on what happens next.'
      return 'The campus is quiet. Too quiet. Spring enrollment is down again. The dining hall closes at 6pm because there aren\'t enough students to justify the evening shift. You teach your classes, run the greenhouse, and go home. At night you read about other colleges closing and wonder how much time is left.'
    },
    choices: [
      {
        text: 'Write a letter to every alumnus you can find. Tell them the truth about where the college is and what it could become. Ask them not for money — for ideas, time, and connections.',
        effects: { morale: 15, communityTrust: 15, donorConfidence: 20, boardUnity: 10 },
        reaction: 'You send 200 letters. You get 47 responses. Some are angry. Some are grateful. Twelve people offer to help. One of them runs a foundation. One manages a workforce development nonprofit. One is a retired contractor who wants to teach. The letter goes viral in the alumni Facebook group. For the first time, the conversation isn\'t "remember the old days." It\'s "what can we build next?"',
        peopleChanges: { topDonor: { mood: 'all in' } }
      },
      {
        text: 'Launch a public campaign: "Millbrook is Open." Invite the town, the county, the employers, the school district. Make the campus the community\'s campus. Commit fully and publicly.',
        effects: { enrollment: 20, morale: 25, communityTrust: 30, donorConfidence: 25, boardUnity: 15, deficit: 1200000 },
        reaction: 'The launch event fills the gymnasium. 400 people. The mayor speaks. The hospital director speaks. A CNA graduate speaks — she tears up and says: "Six months ago I was stocking shelves. Now I\'m saving lives. This campus did that." The contractors bring a welding demo. Kids watch sparks fly and their eyes go wide. The food co-op caters it. You stand in the back of the gym watching the community fill a space that used to be empty at 6pm and you think: this is what a campus is for. The reporter\'s article runs the next day. The headline: "This College Refused to Die. Here\'s What It Built Instead." Your phone doesn\'t stop ringing for a week.',
        peopleChanges: { topDonor: { mood: 'all in' }, facultyLeader: { mood: 'transformed' }, cfo: { mood: 'believes' }, facilities: { mood: 'proud' }, townMayor: { status: 'ally', mood: 'champion' } }
      },
      {
        text: 'Accept that you\'ve done what you can. Keep teaching. Let the institution figure itself out. Some things are bigger than one professor.',
        effects: { morale: -5, communityTrust: -5 },
        reaction: 'You teach. You grade. You go home. It\'s not bad. It\'s not good. It\'s the quiet hum of an institution that hasn\'t decided if it\'s living or dying. You water the greenhouse plants on Saturday morning and a retiree from the community garden group waves through the glass. "See you next week, Professor?" You nod. At least the greenhouse is alive.',
        peopleChanges: {}
      },
      {
        text: 'Go to the board meeting yourself. You\'re not on the agenda. You weren\'t invited. But you know more about what this campus can become than anyone in that room. Ask for five minutes.',
        effects: { morale: 20, communityTrust: 20, donorConfidence: 25, boardUnity: 15 },
        reaction: 'You walk into the boardroom. The chair looks surprised. The president looks nervous. You say: "I wasn\'t invited. I\'m asking for five minutes." The chair nods. You talk about the CNA graduates, the greenhouse, the apprenticeships, the community garden, the faculty who left and the ones who stayed and why. You talk about the students who ask if the school is closing and the ones who post on Instagram that they\'re proud to be here. You talk for seven minutes, not five. Nobody stops you. When you finish, Arthur Hartwell stands up — an 80-year-old man in a boardroom — and starts clapping. One person joins. Then another. The chair says: "I think we\'ve heard our strategic plan."',
        peopleChanges: { topDonor: { mood: 'all in' }, facultyLeader: { mood: 'transformed' }, cfo: { mood: 'believes' }, facilities: { mood: 'proud' } }
      },
    ]
  },
]

const SEMESTERS = [
  {
    label: 'Fall — Year 1',
    narration: 'You\'ve been in the job for three months. The honeymoon is over. Fall enrollment just came in.',
    event: 'First-year deposits are down 14% from last year. The discount rate crept up to 55% because Diana had to offer more aid to fill seats. Patricia is projecting a $2.4M deficit for the year. Dr. Washington wants to hire two new faculty for a data science program. Ray says the science building roof will cost $380K to fix and it can\'t wait another winter. Arthur Hartwell\'s assistant called to schedule a lunch — he wants to "understand the direction."\n\nMeanwhile, you notice a few things: a food cooperative in town just lost its lease and is looking for kitchen space. A LinkedIn post from a regional foundation announces $2M in grants for "innovative workforce-education partnerships." And Ray mentions that a woman who runs a co-working space in the next town over asked if the college ever rents out classroom space on weekends.',
    choices: [
      {
        text: 'Cut three underperforming academic programs and redirect the savings to scholarships and the roof repair.',
        effects: { enrollment: -25, faculty: -4, deficit: 800000, deferred: -380000, morale: -15, communityTrust: -5, donorConfidence: 5, discountRate: -2 },
        reaction: 'Dr. Okonkwo calls an emergency faculty senate meeting. Three professors in the cut programs start applying elsewhere. The local paper runs a story: "College Eliminates Programs Amid Financial Strain." But the roof gets fixed. And the scholarship money stops two transfer-outs. The food co-op finds space elsewhere. The co-working inquiry goes unanswered.',
        peopleChanges: { facultyLeader: { mood: 'furious' } }
      },
      {
        text: 'Approve the data science program, defer the roof, and launch an aggressive enrollment marketing campaign.',
        effects: { enrollment: 10, deficit: -400000, deferred: 200000, morale: 5, donorConfidence: -5, discountRate: 2 },
        reaction: 'The data science program won\'t generate revenue for 18 months. The roof leaks into the chemistry lab during a November storm. Marketing brings in 15 extra applications but the discount rate climbs to cover them. Patricia sends you a memo at 11pm: "We are spending money we don\'t have on things that won\'t pay off in time." You forgot about the foundation grant deadline. It passes.',
        peopleChanges: { cfo: { mood: 'alarmed' } }
      },
      {
        text: 'Call Arthur Hartwell. Be completely honest about the financial situation. Ask what it would take for him to lead a transformation campaign.',
        effects: { enrollment: 0, deficit: 0, donorConfidence: 15, boardUnity: 5, morale: 0 },
        reaction: 'Arthur listens for 40 minutes without interrupting. Then he says: "Thank you. No one has been this honest with me in ten years." He doesn\'t write a check today. But he asks for the full audit. He wants to see the real numbers. He says he\'ll bring two other donors to a private dinner next month. This is the first seed.',
        peopleChanges: { topDonor: { mood: 'engaged' } }
      },
      {
        text: 'Follow up on the co-working inquiry, call the food co-op about the dining hall kitchen, and apply for the workforce-education foundation grant. Fix the roof with the grant if you get it.',
        effects: { enrollment: 0, deficit: 200000, deferred: -100000, morale: 10, communityTrust: 15, donorConfidence: 5 },
        reaction: 'The co-working operator, Melissa Torres, tours three classrooms on a Saturday. She\'s interested — $800/month for weekend and evening access. Small money, but it\'s the first time someone from outside the college has paid to use your space. The food co-op moves their operation into the dining hall kitchen on off-hours — $500/month plus they cater a campus event for free. The foundation grant application takes two weeks of work. You won\'t hear back until spring. But Dr. Okonkwo notices what you\'re doing and says quietly after a meeting: "That\'s different. That\'s actually interesting." Ray is excited — someone is finally asking what the buildings can do instead of what they cost.',
        peopleChanges: { facultyLeader: { mood: 'curious' }, facilities: { mood: 'energized' } }
      },
    ]
  },
  {
    label: 'Spring — Year 1',
    narration: 'Winter was hard. Spring semester started with 12 fewer students than expected — they didn\'t come back from winter break.',
    event: 'The spring retention number is troubling — you lost students over the holiday. Parents are asking questions. The bond trustee sent a letter requesting a meeting about covenant compliance. Diana says fall deposits for next year are "soft." Dr. Washington tells you privately that the provost at a state university just offered him a position. Janet Novak, the town mayor, read the newspaper story about the program cuts and left you a voicemail: "We need to talk about what this means for the town."\n\nYou also notice: a state article about $4M in training grants for carpentry and skilled trades in your region. The hospital 8 miles away just posted 15 open CNA positions on Indeed — they can\'t fill them. A retired faculty member emails you an article about a college in Vermont that\'s transforming into a community-centered learning hub instead of closing. And Dr. Okonkwo forwards you a proposal from three of her faculty colleagues — they want to pilot a weekend "community college within a college" offering non-credit workshops to adults.',
    choices: [
      {
        text: 'Meet with the bond trustee immediately. Bring Patricia. Be transparent about the numbers and propose a forbearance if needed.',
        effects: { deficit: 0, donorConfidence: 5, boardUnity: 10, debt: 0 },
        reaction: 'The trustee appreciates the honesty. They\'ve seen worse. They offer a 12-month forbearance with conditions: monthly financial reporting, no new debt, and a board-approved stabilization plan by December. It\'s not good news, but it\'s manageable news. Patricia says it\'s the first time in two years she\'s felt like leadership is facing reality.',
        peopleChanges: { cfo: { mood: 'cautiously hopeful' } }
      },
      {
        text: 'Call Janet Novak back. Visit her office. Ask what the town needs from the campus — not what the campus needs from the town.',
        effects: { enrollment: 0, communityTrust: 20, morale: 5 },
        reaction: 'Janet is surprised you called back. Most college presidents don\'t. She tells you the town has no workforce training facility, no community meeting space since the Elks Lodge closed, and the school district wants after-school STEM programs but has no space. She says: "If your campus could help with any of that, this town would fight for you." You didn\'t expect to feel hope today.',
        peopleChanges: { townMayor: { status: 'ally', mood: 'energized' } }
      },
      {
        text: 'Convince Dr. Washington to stay by offering him a raise and the title of Executive Vice President.',
        effects: { deficit: -95000, morale: 5, faculty: 0, donorConfidence: -5 },
        reaction: 'James stays, but the faculty notice the raise. In a university running a deficit, giving the provost a title bump and more money lands badly. Dr. Okonkwo says publicly: "I guess we know what leadership values." Two adjuncts who were told there\'s no money for course releases read about it in an email chain. The resentment is quiet but real. The carpentry grants and the faculty workshop proposal both go unaddressed.',
        peopleChanges: { provost: { mood: 'conflicted' }, facultyLeader: { mood: 'bitter' } }
      },
      {
        text: 'Green-light the faculty workshop proposal, apply for the carpentry training grant, and contact the hospital about a CNA training partnership on campus.',
        effects: { enrollment: 5, deficit: 300000, morale: 15, communityTrust: 15, donorConfidence: 10, boardUnity: 5 },
        reaction: 'Three things happen at once. The faculty weekend workshops launch with 28 adults — mostly nurses wanting continuing ed and parents wanting computer skills. Revenue is small but the energy on campus shifts. Dr. Okonkwo becomes the program\'s champion. The carpentry grant application goes in — $180K if you get it, with a requirement to partner with local contractors. And the hospital HR director visits campus, walks through the science building, and says: "We could train 30 CNAs a year here. We\'d pay for it." Patricia runs the numbers that night. She calls you at 7am: "If the hospital partnership works, that\'s $400K in annual revenue we\'ve never had. From one phone call." James Washington reads the Vermont article you forwarded and says: "Maybe I should stay."',
        peopleChanges: { facultyLeader: { mood: 'energized' }, cfo: { mood: 'hopeful' }, provost: { mood: 'interested' } }
      },
    ]
  },
  {
    label: 'Fall — Year 2',
    narration: 'A full year in. The decisions you made last year are showing their consequences. Fall enrollment is in.',
    event: (state) => {
      const enrollDown = state.enrollment < 780
      const moraleIssue = state.morale < 50
      const mayorAlly = state.people.townMayor.status === 'ally'
      let text = `Enrollment is ${state.enrollment + (enrollDown ? -30 : 10)}. `
      if (enrollDown) text += 'The downward trend is accelerating. '
      if (moraleIssue) text += 'Faculty morale is low — two more just resigned. '
      if (mayorAlly) text += 'Mayor Novak has been talking to the county economic development office about workforce training partnerships. '
      text += 'Arthur Hartwell had that donor dinner. Three people came. They want to see a plan — a real one, not a brochure. The accreditor sent a letter requesting a supplemental financial report.\n\n'
      text += 'Other signals are arriving: a local contractors\' association reached out about apprenticeship space — they\'ll pay rent and provide instructors if you provide classrooms and workshop space. Melissa Torres, the co-working operator, tells you she has a waiting list and wants to expand into two more rooms. The county announces a new registered apprenticeship initiative with federal matching funds. And a board member forwards you an article about Meta\'s $115M skilled trades academy — with the note: "Why can\'t we do something like this here?"'
      text += '\n\nYou\'re at a fork in the road. What you decide this semester defines everything that follows.'
      return text
    },
    choices: [
      {
        text: 'Present a formal transformation plan to the board: diversify revenue, open the campus to community programs, workforce training, and non-degree credentials. Keep the college running alongside the new model.',
        effects: { enrollment: 15, deficit: 600000, morale: 10, communityTrust: 15, donorConfidence: 20, boardUnity: 10, discountRate: -3 },
        reaction: 'The board votes 7-3 to explore transformation. Arthur Hartwell pledges $500K to fund a pilot. Janet Novak brings the county workforce board to campus. Dr. Okonkwo is cautiously interested — she asks if faculty would have a role in designing the new programs. Ray walks you through every building and shows you which spaces could be converted. For the first time, people are talking about the future instead of managing decline.',
        peopleChanges: { topDonor: { mood: 'committed' }, facultyLeader: { mood: 'cautiously interested' }, facilities: { mood: 'hopeful' } }
      },
      {
        text: 'Double down on the traditional model: launch an emergency enrollment campaign, increase the discount rate to 65%, and cut institutional support costs by 20%.',
        effects: { enrollment: 25, deficit: 200000, morale: -20, communityTrust: -10, donorConfidence: -10, discountRate: 13 },
        reaction: 'The enrollment bump is real — but at 65% discount rate, each new student generates almost nothing in net revenue. You\'re filling seats with money you don\'t have. The institutional support cuts mean fewer advisors, slower IT response, and a registrar\'s office that can\'t keep up. Students notice. Arthur Hartwell goes quiet. Patricia says: "We just bought one more year. At the cost of two." The contractors\' association takes their apprenticeship to the community college instead.',
        peopleChanges: { cfo: { mood: 'defeated' }, topDonor: { mood: 'disengaged' } }
      },
      {
        text: 'Begin confidential merger conversations with a larger regional university.',
        effects: { enrollment: 0, morale: -10, communityTrust: -15, boardUnity: -15, donorConfidence: -5 },
        reaction: 'The conversations are "confidential" for about 72 hours. A board member tells a friend. The friend tells the newspaper. "COLLEGE IN MERGER TALKS" runs above the fold. Parents panic. Three deposits for fall are withdrawn. Faculty start applying everywhere. Dr. Washington takes the state university job. The merger might be the right move — but the way it leaked poisoned everything.',
        peopleChanges: { provost: { status: 'left', mood: 'gone' }, facultyLeader: { mood: 'panicked' } }
      },
      {
        text: 'Say yes to everything that\'s knocking on your door: contractors\' apprenticeship, co-working expansion, county apprenticeship funding, hospital CNA pipeline. Build the transformation from the ground up — with paying partners first, plan second.',
        effects: { enrollment: 10, deficit: 900000, morale: 20, communityTrust: 25, donorConfidence: 15, boardUnity: 10, discountRate: -2 },
        reaction: 'It\'s messy. There\'s no grand plan yet — just a campus that\'s suddenly busy in ways it hasn\'t been in years. Contractors in the workshop Monday through Thursday. Melissa\'s co-working crowd on weekends. CNA trainees in the science building. The dining hall hosts a community dinner that 140 people attend. Arthur Hartwell visits campus unannounced, sees the activity, and calls you that evening: "This is alive. This is what I wanted to fund." The board member who sent the Meta article says at the next meeting: "I think it\'s already happening." Dr. Okonkwo assigns two faculty to develop a for-credit pathway that connects to the apprenticeship. Ray installs a new sign by the entrance: "Millbrook College — Open to the Community." He paid for it himself.',
        peopleChanges: { topDonor: { mood: 'committed' }, facultyLeader: { mood: 'leading' }, facilities: { mood: 'proud' }, townMayor: { status: 'ally', mood: 'champion' } }
      },
    ]
  },
  {
    label: 'Spring — Year 2',
    narration: 'The trajectory is set. This semester determines whether the institution finds a new path or begins the final descent.',
    event: (state) => {
      const transforming = state.donorConfidence > 65 && state.communityTrust > 60
      const declining = state.morale < 40 || state.enrollment < 730
      const merged = state.boardUnity < 35
      if (merged) return 'The merger talks have consumed everything. The partner university is offering terms — but they want to eliminate 60% of your programs and absorb the rest under their brand. The name disappears. Half the staff is redundant. It\'s not a merger. It\'s an acquisition with polite language.'
      if (transforming) return 'The transformation pilot is underway. A workforce training program launched in January with 22 participants — adults, not traditional students. The county is paying. The first community health screening happened in the gym. 180 people came. The nursing faculty ran it. Arthur Hartwell brought a foundation program officer to campus. She wants to see the data in June. The accreditor is watching closely — but they\'re interested, not hostile. A reporter from the Pittsburgh paper called — she\'s writing about "colleges that refused to die." The contractors\' apprenticeship program graduated its first cohort: 14 people, 12 placed in jobs within a month. Melissa Torres hired a part-time employee to manage the co-working space. And a delegation from a struggling college in Indiana called — they want to visit and see what you\'re doing.'
      if (declining) return 'Spring enrollment dropped again. Two more faculty left. The registrar retired and hasn\'t been replaced. Students are complaining about response times, broken equipment, and courses being cancelled. The local paper ran an editorial: "Is This the End for Our College?" Parents are calling the admissions office asking if their kids should transfer. The bond trustee wants another meeting. Meanwhile, the opportunities you didn\'t pursue found other homes — the contractors went to the community college, the co-working operator leased space downtown, and the hospital started its own CNA training in-house.'
      return 'The institution is stable but stagnant. You haven\'t gotten worse, but you haven\'t changed anything fundamental. The same pressures are building. The same questions are unanswered. Time is passing and the window is narrowing. An email from the state workforce board sits unopened in your inbox. A voicemail from a local manufacturer about training partnerships went unreturned. The world is moving. You\'re standing still.'
    },
    choices: [
      {
        text: 'Go all in on transformation. Announce publicly that the college is evolving — new workforce programs, community partnerships, campus open to the region. Tell the whole story honestly.',
        effects: { enrollment: 20, deficit: 1200000, morale: 20, communityTrust: 25, donorConfidence: 25, boardUnity: 15 },
        reaction: 'The announcement lands differently than you expected. Instead of panic, there\'s relief. Faculty say: "Finally, someone said it out loud." Alumni write in — some angry, most supportive. The newspaper runs a follow-up: "College Charts Bold New Course." Arthur Hartwell calls and says three words: "Now I\'m in." The hardest part isn\'t the transformation. It\'s the honesty. And the honesty is what unlocks everything.',
        peopleChanges: { topDonor: { mood: 'all in' }, facultyLeader: { mood: 'committed' }, cfo: { mood: 'relieved' } }
      },
      {
        text: 'Hold steady. Make incremental improvements. Hope that next year\'s enrollment is better.',
        effects: { enrollment: -15, deficit: -300000, morale: -10, communityTrust: -10, donorConfidence: -15 },
        reaction: 'Nothing changes. Which means everything gets worse, slowly. Three more faculty leave over the summer. Fall deposits come in 20% below target. Arthur Hartwell donates to another institution. The bond trustee sends a second letter — this one is less friendly. Patricia updates her resume. She doesn\'t tell you.',
        peopleChanges: { cfo: { mood: 'preparing to leave' }, topDonor: { mood: 'gone' } }
      },
      {
        text: 'Accept the merger terms. Preserve what you can. Save the jobs you can save.',
        effects: { enrollment: 0, morale: -25, communityTrust: -20, boardUnity: -10 },
        reaction: 'The partner university takes over operations by fall. The name changes. 60% of programs are eliminated. 28 staff positions are cut. The campus stays open — as a satellite location with limited offerings. Ray keeps his job maintaining the buildings. Most faculty don\'t. The town feels betrayed. It\'s not the worst outcome. But standing in the empty student center on the last day of the semester, watching Diana carry a box to her car, it doesn\'t feel like a victory.',
        peopleChanges: { enrollmentVP: { status: 'left', mood: 'gone' }, facultyLeader: { status: 'left', mood: 'gone' } }
      },
      {
        text: 'Invite the visiting Indiana delegation, the Pittsburgh reporter, and the foundation program officer to campus on the same week. Let them see it. Let the community see them seeing it. Make the transformation visible and public.',
        effects: { enrollment: 25, deficit: 1500000, morale: 25, communityTrust: 30, donorConfidence: 30, boardUnity: 20 },
        reaction: 'The week changes everything. The Indiana delegation walks the campus and takes notes for three hours. The reporter interviews Ray, Dr. Okonkwo, Melissa Torres, two CNA trainees, and a 58-year-old woman taking her first computer class. The article runs with the headline: "This College Refused to Die. Here\'s What It Built Instead." The foundation officer tells Arthur Hartwell she\'s recommending a $750K grant. The town council passes a resolution of support. Students — the traditional ones still enrolled — read the article and something shifts. One of them posts on Instagram: "My school is doing something no one else is doing. I\'m proud to be here." It gets 2,000 likes. Diana Santos, for the first time in four years, smiles in a staff meeting.\n\nThe accreditor calls. They don\'t call to threaten. They call to ask if they can send a team to study what you\'re doing. They\'re seeing the same crisis everywhere. They want to know if this works.\n\nRay puts a second sign up, on the other side of campus. This one says: "Welcome to Millbrook. A campus for the whole community."',
        peopleChanges: { topDonor: { mood: 'all in' }, facultyLeader: { mood: 'leading' }, cfo: { mood: 'believes' }, facilities: { mood: 'proud' }, enrollmentVP: { mood: 'hopeful' }, townMayor: { status: 'ally', mood: 'champion' } }
      },
    ]
  },
]

const ENDINGS = {
  transformed: {
    title: 'Transformed',
    color: '#00A8A8',
    icon: '🌅',
    text: 'Two years later, the campus is alive in ways it hasn\'t been in a decade. The workforce training center runs three shifts. The nursing program partnered with the regional hospital. The old gym hosts a farmers market on Saturdays. Enrollment is different now — fewer 18-year-olds, more 35-year-olds, more community members, more employers sending workers for training. Net revenue is up. The deficit is closing. Arthur Hartwell gave $2M and told the foundation program officer this is "the most important thing happening in higher education right now." Ray still knows every pipe and wire. He also runs the building tours for visitors from other colleges who want to see how it\'s done. The name stayed. The mission evolved. The campus lived.'
  },
  survived: {
    title: 'Survived — For Now',
    color: '#D97706',
    icon: '⏳',
    text: 'The college is still open. That\'s the best thing you can say. Enrollment stabilized but didn\'t grow. The deficit narrowed but didn\'t close. The bond terms were renegotiated — barely. Faculty morale is fragile. The town is supportive but tired of uncertainty. You bought time. The question is what you do with it. The next president will inherit the same problems you did — unless someone, somewhere, has the courage to do something different. The window is still open. But it\'s closing.'
  },
  merged: {
    title: 'Merged',
    color: '#3B82F6',
    icon: '🤝',
    text: 'The campus is still there. The sign out front says a different name. Some programs survived. Some staff kept their jobs. The town lost its college but gained a satellite campus of a larger university. It\'s not nothing — but it\'s not what it was. The alumni association dissolved. The homecoming tradition ended. Ray retired early. Patricia took a job at a hospital system. Dr. Okonkwo moved to another state. The campus functions, but the soul of the place — the thing that made students feel like they belonged — that\'s harder to find now. Mergers save buildings. They don\'t always save communities.'
  },
  closed: {
    title: 'Closed',
    color: '#DC2626',
    icon: '🔒',
    text: 'The board voted 6-4 to cease operations at the end of the academic year. Students were given teach-out agreements with partner institutions. Faculty received 90 days notice. Ray was the last person to leave the campus. He locked the front door of Founders Hall, stood in the parking lot for a long time, and drove home. A developer bought the property eight months later. The residence halls were demolished first. Then the student center. The science building is still standing — it\'s a storage facility now. Janet Novak told the newspaper: "We lost more than a college. We lost the center of this town." She was right.'
  }
}

function getEnding(state) {
  if (state.enrollment < 650 && state.morale < 30) return 'closed'
  if (state.boardUnity < 30 || (state.enrollment < 700 && state.donorConfidence < 30)) return 'merged'
  if (state.donorConfidence > 70 && state.communityTrust > 70 && state.morale > 55) return 'transformed'
  return 'survived'
}

function StatBar({ label, value, max = 100, color = '#00A8A8', showValue }) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100))
  return (
    <div>
      <div className="flex justify-between items-baseline mb-1">
        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{label}</span>
        <span className="text-[10px] font-bold" style={{ color }}>{showValue || value}</span>
      </div>
      <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
        <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pct}%`, background: pct < 30 ? '#DC2626' : pct < 50 ? '#D97706' : color }} />
      </div>
    </div>
  )
}

function PersonCard({ person, role }) {
  if (person.status === 'left' || person.status === 'gone') {
    return (
      <div className="flex items-center gap-2 opacity-40">
        <span className="text-xs">👤</span>
        <div>
          <p className="text-[10px] font-bold text-gray-400 line-through">{person.name}</p>
          <p className="text-[9px] text-gray-400">{role} — departed</p>
        </div>
      </div>
    )
  }
  const moodColors = {
    'exhausted': '#D97706', 'frustrated': '#D97706', 'scared': '#DC2626', 'overwhelmed': '#D97706',
    'skeptical': '#D97706', 'angry': '#DC2626', 'worried': '#D97706', 'furious': '#DC2626',
    'alarmed': '#DC2626', 'bitter': '#DC2626', 'cautiously hopeful': '#059669', 'energized': '#059669',
    'engaged': '#059669', 'committed': '#059669', 'hopeful': '#059669', 'cautiously interested': '#059669',
    'conflicted': '#D97706', 'defeated': '#DC2626', 'disengaged': '#DC2626', 'panicked': '#DC2626',
    'all in': '#059669', 'relieved': '#059669', 'preparing to leave': '#DC2626', 'gone': '#94A3B8',
  }
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs">👤</span>
      <div>
        <p className="text-[10px] font-bold" style={{ color: '#0C1F3F' }}>{person.name}</p>
        <p className="text-[9px]"><span className="text-gray-400">{role}</span> · <span style={{ color: moodColors[person.mood] || '#94A3B8' }}>{person.mood}</span></p>
      </div>
    </div>
  )
}

export default function CollegeGame() {
  const [role, setRole] = useState(null)
  const [state, setState] = useState(INITIAL)
  const [chosenIdx, setChosenIdx] = useState(null)
  const [showReaction, setShowReaction] = useState(false)
  const tracked = useRef(false)

  // Role selection
  if (!role) {
    return (
      <section className="min-h-screen" style={{ background: '#0A0A0A' }}>
        <div className="max-w-2xl mx-auto px-6 py-20">
          <Link href="/" className="text-sm text-gray-600 hover:text-gray-400 mb-8 inline-block">&larr; Campus Transformation</Link>
          <h1 className="font-serif text-white mb-2" style={{ fontSize: 'clamp(32px, 5vw, 52px)', lineHeight: 1.1, letterSpacing: '-0.02em' }}>
            Don't Close.<br /><span style={{ color: '#00A8A8' }}>Transform.</span>
          </h1>
          <p className="text-gray-500 text-sm mb-12 max-w-md">A college survival simulation. Real decisions. Real consequences. Real people whose lives depend on what you choose.</p>

          <p className="text-xs font-bold uppercase tracking-wider text-gray-600 mb-4">Choose your role</p>
          <div className="space-y-3">
            {ROLES.map(r => (
              <button key={r.id} onClick={() => setRole(r.id)}
                      className="w-full text-left p-5 rounded-xl border border-gray-800 bg-gray-900 hover:border-gray-600 hover:bg-gray-800 transition-all">
                <div className="flex items-start gap-4">
                  <span className="text-3xl">{r.icon}</span>
                  <div>
                    <p className="text-white font-bold">{r.title}</p>
                    <p className="text-gray-500 text-sm mt-1">{r.desc}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>

          <div className="mt-12 border-t border-gray-800 pt-6 space-y-3">
            <p className="text-[10px] text-gray-700 leading-relaxed max-w-sm">
              Based on real financial data, real board dynamics, and real human consequences from colleges across America. No names are real. Everything else is.
            </p>
            <div className="flex gap-3">
              <a href="/" className="text-[10px] font-bold hover:underline" style={{ color: '#00A8A8' }}>
                Learn about Campus Transformation &rarr;
              </a>
              <a href="mailto:jeff@transformlearning.ai?subject=Feedback on the College Survival Game" className="text-[10px] font-bold text-gray-600 hover:underline">
                Send feedback
              </a>
            </div>
          </div>
        </div>
      </section>
    )
  }

  // Check ending
  const totalSemesters = role === 'faculty' ? FACULTY_SEMESTERS.length : SEMESTERS.length
  if (state.semester >= totalSemesters && !showReaction) {
    const endingKey = getEnding(state)
    const ending = ENDINGS[endingKey]

    // Save play data once
    if (!tracked.current) {
      tracked.current = true
      supabase.from('game_plays').insert({
        role,
        ending: endingKey,
        enrollment: state.enrollment,
        morale: state.morale,
        community_trust: state.communityTrust,
        donor_confidence: state.donorConfidence,
        board_unity: state.boardUnity,
        discount_rate: state.discountRate,
        choices: state.events || [],
      }).then(() => {}).catch(() => {})
    }
    return (
      <section className="min-h-screen" style={{ background: '#0A0A0A' }}>
        <div className="max-w-2xl mx-auto px-6 py-16">
          <div className="text-center mb-8">
            <span className="text-6xl block mb-4">{ending.icon}</span>
            <h1 className="font-serif text-3xl text-white mb-2">{ending.title}</h1>
            <div className="w-16 h-1 rounded-full mx-auto" style={{ background: ending.color }} />
          </div>
          <p className="text-gray-400 text-sm leading-relaxed mb-8">{ending.text}</p>

          <div className="bg-gray-900 rounded-xl p-5 mb-6">
            <p className="text-xs font-bold uppercase tracking-wider text-gray-600 mb-3">Final State</p>
            <div className="grid grid-cols-2 gap-x-6 gap-y-2">
              <StatBar label="Enrollment" value={state.enrollment} max={1000} showValue={state.enrollment} />
              <StatBar label="Morale" value={state.morale} />
              <StatBar label="Community Trust" value={state.communityTrust} />
              <StatBar label="Donor Confidence" value={state.donorConfidence} />
              <StatBar label="Board Unity" value={state.boardUnity} />
              <StatBar label="Discount Rate" value={100 - state.discountRate} max={100} showValue={`${state.discountRate}%`} />
            </div>
          </div>

          <div className="bg-gray-900 rounded-xl p-5 mb-8">
            <p className="text-xs font-bold uppercase tracking-wider text-gray-600 mb-3">Your People</p>
            <div className="grid grid-cols-2 gap-3">
              <PersonCard person={state.people.cfo} role="CFO" />
              <PersonCard person={state.people.provost} role="Provost" />
              <PersonCard person={state.people.facilities} role="Facilities" />
              <PersonCard person={state.people.enrollmentVP} role="Enrollment VP" />
              <PersonCard person={state.people.topDonor} role="Top Donor" />
              <PersonCard person={state.people.facultyLeader} role="Faculty Leader" />
              <PersonCard person={state.people.townMayor} role="Mayor" />
            </div>
          </div>

          <div className="text-center space-y-4">
            <button onClick={() => { setRole(null); setState(INITIAL); setChosenIdx(null); setShowReaction(false); tracked.current = false }}
                    className="px-6 py-3 rounded-xl text-white font-bold text-sm" style={{ background: '#00A8A8' }}>
              Play Again as a Different Role
            </button>

            <div className="bg-gray-900 rounded-xl p-5 text-left max-w-md mx-auto border border-gray-800">
              <p className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: '#00A8A8' }}>This isn't just a game.</p>
              <p className="text-sm text-gray-400 leading-relaxed mb-4">
                Real colleges are facing these decisions right now. Two close every week. If you're a president, board member, faculty member, or community leader — or if you just want to learn more — we'd love to hear from you.
              </p>
              <div className="space-y-2">
                <a href="/"
                   className="block w-full text-center py-2.5 rounded-lg text-white text-sm font-bold"
                   style={{ background: '#00A8A8' }}>
                  Learn About Campus Transformation
                </a>
                <a href="/inquiry"
                   className="block w-full text-center py-2.5 rounded-lg text-sm font-bold border"
                   style={{ color: '#00A8A8', borderColor: '#00A8A8' }}>
                  Start a Confidential Conversation
                </a>
                <a href="mailto:jeff@transformlearning.ai?subject=Feedback on the College Survival Game"
                   className="block w-full text-center py-2.5 rounded-lg text-sm font-bold text-gray-500 border border-gray-700 hover:border-gray-500">
                  Send Us Feedback on the Game
                </a>
              </div>
            </div>

            <p className="text-[10px] text-gray-700 max-w-sm mx-auto">
              Built by <a href="/" className="underline" style={{ color: '#00A8A8' }}>Campus Transformation</a> — a Pittsburgh-based consultancy helping communities transform at-risk colleges into workforce and community hubs.
            </p>
          </div>
        </div>
      </section>
    )
  }

  const semesterList = role === 'faculty' ? FACULTY_SEMESTERS : SEMESTERS
  const semester = semesterList[state.semester]
  const eventText = typeof semester.event === 'function' ? semester.event(state) : semester.event

  function choose(idx) {
    if (chosenIdx !== null) return
    setChosenIdx(idx)
    setShowReaction(true)
  }

  function advance() {
    const choice = semester.choices[chosenIdx]
    setState(prev => {
      const next = { ...prev }
      next.semester = prev.semester + 1
      next.events = [...(prev.events || []), { semester: semester.label, choice: chosenIdx, text: choice.text.substring(0, 80) }]
      if (choice.effects.enrollment) next.enrollment = Math.max(0, prev.enrollment + choice.effects.enrollment)
      if (choice.effects.faculty) next.faculty = Math.max(0, prev.faculty + choice.effects.faculty)
      if (choice.effects.deficit) next.deficit = prev.deficit + choice.effects.deficit
      if (choice.effects.deferred) next.deferred = Math.max(0, prev.deferred + choice.effects.deferred)
      if (choice.effects.morale) next.morale = Math.min(100, Math.max(0, prev.morale + choice.effects.morale))
      if (choice.effects.communityTrust) next.communityTrust = Math.min(100, Math.max(0, prev.communityTrust + choice.effects.communityTrust))
      if (choice.effects.donorConfidence) next.donorConfidence = Math.min(100, Math.max(0, prev.donorConfidence + choice.effects.donorConfidence))
      if (choice.effects.boardUnity) next.boardUnity = Math.min(100, Math.max(0, prev.boardUnity + choice.effects.boardUnity))
      if (choice.effects.discountRate) next.discountRate = Math.min(100, Math.max(0, prev.discountRate + choice.effects.discountRate))
      // People changes
      if (choice.peopleChanges) {
        next.people = { ...prev.people }
        Object.entries(choice.peopleChanges).forEach(([key, changes]) => {
          next.people[key] = { ...prev.people[key], ...changes }
        })
      }
      return next
    })
    setChosenIdx(null)
    setShowReaction(false)
  }

  return (
    <section className="min-h-screen" style={{ background: '#0A0A0A' }}>
      <div className="max-w-3xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider" style={{ color: '#00A8A8' }}>
              {semester.label}
            </p>
            <p className="text-[10px] text-gray-600">Playing as: {ROLES.find(r => r.id === role)?.title}</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] text-gray-600">Enrollment</p>
            <p className="text-lg font-light text-white">{state.enrollment}</p>
          </div>
        </div>

        {/* Dashboard */}
        <div className="bg-gray-900 rounded-xl p-4 mb-6">
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
            <StatBar label="Morale" value={state.morale} />
            <StatBar label="Community" value={state.communityTrust} />
            <StatBar label="Donors" value={state.donorConfidence} />
            <StatBar label="Board" value={state.boardUnity} />
            <StatBar label="Discount" value={100 - state.discountRate} max={100} showValue={`${state.discountRate}%`} />
            <StatBar label="Faculty" value={state.faculty} max={60} showValue={state.faculty} />
          </div>
          <div className="mt-3 pt-3 border-t border-gray-800 grid grid-cols-2 sm:grid-cols-4 gap-2">
            {Object.entries(state.people).slice(0, 4).map(([key, person]) => (
              <PersonCard key={key} person={person} role={key.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase())} />
            ))}
          </div>
        </div>

        {/* Narration */}
        <div className="mb-6">
          <p className="text-gray-500 text-sm leading-relaxed mb-4">{semester.narration}</p>
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
            <p className="text-gray-300 text-sm leading-relaxed">{eventText}</p>
          </div>
        </div>

        {/* Choices */}
        {!showReaction && (
          <div className="space-y-3">
            <p className="text-xs font-bold uppercase tracking-wider text-gray-600">What do you do?</p>
            {semester.choices.map((c, i) => (
              <button key={i} onClick={() => choose(i)}
                      className="w-full text-left p-4 rounded-xl border border-gray-800 bg-gray-900 hover:border-gray-600 hover:bg-gray-800 transition-all">
                <p className="text-sm text-gray-300 leading-relaxed">{c.text}</p>
              </button>
            ))}
          </div>
        )}

        {/* Reaction */}
        {showReaction && chosenIdx !== null && (
          <div>
            <div className="bg-gray-900 border-l-4 rounded-xl p-5 mb-4" style={{ borderColor: '#00A8A8' }}>
              <p className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: '#00A8A8' }}>What happens</p>
              <p className="text-sm text-gray-300 leading-relaxed">{semester.choices[chosenIdx].reaction}</p>
            </div>
            <button onClick={advance}
                    className="w-full py-3 rounded-xl text-white font-bold text-sm"
                    style={{ background: '#0C1F3F' }}>
              {state.semester + 1 >= totalSemesters ? 'See How It Ends' : 'Next Semester →'}
            </button>
          </div>
        )}
      </div>
    </section>
  )
}
