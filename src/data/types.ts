export type RawQuestion = [
  question: string,
  options: [string, string, string, string],
  correctAnswer: 0 | 1 | 2 | 3,
  explanation: string,
  hint: string,
];

export type TopicBank = Record<string, RawQuestion[]>;

export interface Question {
  id: string;
  category: string;
  topic: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  hint: string;
}
