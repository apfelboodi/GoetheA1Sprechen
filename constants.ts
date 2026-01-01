import type { Part2Card, Part3Card } from './types';

export const part1Prompts: string[] = [
  'Name?',
  'Alter?',
  'Land?',
  'Wohnort?',
  'Sprachen?',
  'Beruf?',
  'Hobby?',
];

export const part2Cards: Record<string, Part2Card[]> = {
  'Essen & Trinken': [
    { word: 'Frühstück', imageUrl: 'https://apfel.ir/azmoon/3/1.gif', exampleQuestion: 'Was essen Sie gern zum Frühstück?' },
    { word: 'Lieblingsessen', imageUrl: 'https://apfel.ir/azmoon/3/2.gif', exampleQuestion: 'Was ist Ihr Lieblingsessen?' },
    { word: 'Sonntag', imageUrl: 'https://apfel.ir/azmoon/3/3.gif', exampleQuestion: 'Kochen Sie am Sonntag zu Hause?' },
    { word: 'Bier', imageUrl: 'https://apfel.ir/azmoon/3/4.gif', exampleQuestion: 'Trinken Sie gern Bier?' },
    { word: 'Fleisch', imageUrl: 'https://apfel.ir/azmoon/3/5.gif', exampleQuestion: 'Essen Sie lieber Fleisch oder Fisch?' },
    { word: 'Brot', imageUrl: 'https://apfel.ir/azmoon/3/6.gif', exampleQuestion: 'Wo kaufen Sie normalerweise Brot?' },
  ],
  'Einkaufen': [
    { word: 'Zeitung', imageUrl: 'https://apfel.ir/azmoon/3/7.gif', exampleQuestion: 'Können Sie mir bitte eine Zeitung kaufen?' },
    { word: 'Kasse', imageUrl: 'https://apfel.ir/azmoon/3/8.gif', exampleQuestion: 'Entschuldigung, wo ist die Kasse?' },
    { word: 'Obst', imageUrl: 'https://apfel.ir/azmoon/3/9.gif', exampleQuestion: 'Welches Obst essen Sie gern?' },
    { word: 'Schuhe', imageUrl: 'https://apfel.ir/azmoon/3/10.gif', exampleQuestion: 'Wo kann ich hier Schuhe kaufen?' },
    { word: 'Buch', imageUrl: 'https://apfel.ir/azmoon/3/11.gif', exampleQuestion: 'Haben Sie ein deutsches Buch für mich?' },
    { word: 'Stadtplan', imageUrl: 'https://apfel.ir/azmoon/3/12.gif', exampleQuestion: 'Haben Sie einen Stadtplan von Berlin?' },
  ],
};

export const part3Cards: Part3Card[] = [
    { title: 'Musik, CD', imageUrl: 'https://apfel.ir/azmoon/4/1.gif', exampleRequest: 'Können Sie die Musik bitte etwas lauter machen?', exampleResponse: 'Ja, gern.' },
    { title: 'Buch', imageUrl: 'https://apfel.ir/azmoon/4/2.gif', exampleRequest: 'Geben Sie mir bitte Ihr Heft?', exampleResponse: 'Ja, hier, bitte schön.' },
    { title: 'Flasche, Getränk', imageUrl: 'https://apfel.ir/azmoon/4/3.gif', exampleRequest: 'Öffnen Sie bitte die Flasche?', exampleResponse: 'Ja, natürlich.' },
    { title: 'Kugelschreiber', imageUrl: 'https://apfel.ir/azmoon/4/4.gif', exampleRequest: 'Kann ich bitte einen Stift haben?', exampleResponse: 'Ja, hier ist einer.' },
    { title: 'Stuhl', imageUrl: 'https://apfel.ir/azmoon/4/5.gif', exampleRequest: 'Entschuldigung, ist dieser Platz frei?', exampleResponse: 'Nein, tut mir leid, er ist besetzt.' },
    { title: 'Uhr, Zeit', imageUrl: 'https://apfel.ir/azmoon/4/6.gif', exampleRequest: 'Entschuldigung, wie spät ist es bitte?', exampleResponse: 'Es ist halb drei.' },
    { title: 'Apfel', imageUrl: 'https://apfel.ir/azmoon/4/7.gif', exampleRequest: 'Kann ich bitte einen Apfel haben?', exampleResponse: 'Ja, natürlich. Nehmen Sie!' },
    { title: 'Besteck, Essen', imageUrl: 'https://apfel.ir/azmoon/4/8.gif', exampleRequest: 'Bringen Sie mir bitte eine Gabel?', exampleResponse: 'Ja, sofort.' },
    { title: 'Glas Wasser', imageUrl: 'https://apfel.ir/azmoon/4/9.gif', exampleRequest: 'Ich möchte bitte ein Glas Wasser.', exampleResponse: 'Mit oder ohne Kohlensäure?' },
    { title: 'Rauchen verboten', imageUrl: 'https://apfel.ir/azmoon/4/10.gif', exampleRequest: 'Darf man hier rauchen?', exampleResponse: 'Nein, Rauchen ist hier verboten.' },
    { title: 'Tasche', imageUrl: 'https://apfel.ir/azmoon/4/11.gif', exampleRequest: 'Können Sie mir bitte mit der Tasche helfen?', exampleResponse: 'Ja, gern. Sie ist sehr schwer!' },
    { title: 'Radio', imageUrl: 'https://apfel.ir/azmoon/4/12.gif', exampleRequest: 'Können Sie bitte das Radio anmachen?', exampleResponse: 'Ja, mache ich.' },
];