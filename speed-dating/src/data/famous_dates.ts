// these are some special dates that are famous in history, pop culture, etc.
// use this for special gameplays or just to have fun with the players

import { MonthKey } from "./date_maps";

export type SpecialDate = {
  month: MonthKey;
  day: number;
  year: number;
  description: string;
};
export const famousDates: SpecialDate[] = [
  {
    month: 11,
    day: 5,
    year: 1955,
    description:
      "Back to the Future Day. Marty McFly travels to the future in the movie Back to the Future II.",
  },
  {
    month: 7,
    day: 14,
    year: 1789,
    description:
      "Bastille Day. The French Revolution begins with the storming of the Bastille.",
  },
  {
    month: 4,
    day: 12,
    year: 1961,
    description:
      "First human space flight. Yuri Gagarin, a Soviet astronaut, becomes the first human to journey into outer space.",
  },
  {
    month: 10,
    day: 29,
    year: 1929,
    description:
      "Black Tuesday. The most devastating stock market crash in the history of the United States, marking the start of the Great Depression.",
  },
  {
    month: 12,
    day: 25,
    year: 1991,
    description:
      "The dissolution of the Soviet Union. Marking the end of the Cold War, the USSR is formally dissolved into 15 sovereign republics.",
  },
  {
    month: 6,
    day: 28,
    year: 1914,
    description:
      "Assassination of Archduke Franz Ferdinand. This event triggered a series of events that led to the start of World War I.",
  },
  {
    month: 12,
    day: 17,
    year: 1903,
    description:
      "First powered flight. The Wright brothers successfully conduct the first powered flight of an airplane.",
  },
  {
    month: 10,
    day: 24,
    year: 1945,
    description:
      "Founding of the United Nations. Following World War II, the United Nations is established to promote peace and security across the globe.",
  },
  {
    month: 1,
    day: 1,
    year: 2000,
    description:
      "The beginning of the 21st century. Marking the start of the new millennium.",
  },
  {
    month: 9,
    day: 11,
    year: 2001,
    description:
      "9/11. The September 11 attacks on the World Trade Center and the Pentagon.",
  },
  {
    month: 12,
    day: 1,
    year: 1955,
    description:
      "Rosa Parks refuses to give up her bus seat. Her arrest became a pivotal event in the Civil Rights Movement.",
  },
  {
    month: 11,
    day: 9,
    year: 1989,
    description:
      "Fall of the Berlin Wall. The barrier that divided West Berlin from East Berlin and East Germany comes down, symbolizing the end of the Cold War.",
  },
  {
    month: 8,
    day: 6,
    year: 1945,
    description:
      "Atomic bombing of Hiroshima. The United States drops the first atomic bomb on Hiroshima, Japan during World War II.",
  },
  {
    month: 9,
    day: 11,
    year: 2001,
    description:
      "September 11 attacks. Coordinated terrorist attacks by al-Qaeda on the United States, leading to widespread destruction and loss of life.",
  },
  {
    month: 10,
    day: 31,
    year: 1517,
    description:
      "Martin Luther posts the 95 Theses. Sparking the beginning of the Protestant Reformation.",
  },
  {
    month: 7,
    day: 16,
    year: 1969,
    description:
      "Launch of Apollo 11. The mission that first landed humans on the Moon.",
  },
  {
    month: 5,
    day: 25,
    year: 1977,
    description:
      "Release of Star Wars. The first film in the Star Wars franchise is released, forever changing the landscape of cinema.",
  },
  {
    month: 6,
    day: 6,
    year: 1944,
    description:
      "D-Day. Allied forces land on the beaches of Normandy, France, marking the beginning of the end of World War II in Europe.",
  },
  {
    month: 11,
    day: 19,
    year: 1863,
    description:
      "Lincoln delivers the Gettysburg Address. A short speech by Abraham Lincoln during the American Civil War, considered one of the greatest speeches in American history.",
  },
  {
    month: 1,
    day: 30,
    year: 1969,
    description:
      "The Beatles' rooftop concert. The last public performance of the Beatles, held on the roof of Apple Records in London.",
  },
];
