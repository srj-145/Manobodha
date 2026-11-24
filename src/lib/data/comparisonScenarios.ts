export interface TheoryApproach {
  id: string;
  theoryName: string;
  coreMechanism: string;
  intervention: string;
  predictedOutcome: string;
  color: string;
}

export interface ScenarioComparison {
  id: string;
  title: string;
  category: string;
  description: string;
  theories: TheoryApproach[];
}

export const COMPARISON_SCENARIOS: ScenarioComparison[] = [
  {
    id: 'procrastination',
    title: 'Academic Procrastination on a Term Paper',
    category: 'Learning & Cognition',
    description: 'A university student repeatedly delays starting a major assignment until 48 hours before the deadline, triggering acute anxiety and poor output quality.',
    theories: [
      {
        id: 'operant',
        theoryName: 'Operant Conditioning (Behavioral)',
        coreMechanism: 'Negative reinforcement: avoiding the aversive writing task temporarily relieves anxiety, which reinforces the procrastination loop.',
        intervention: 'Token economy / Premack Principle: pair small writing milestones immediately with preferred reinforcing leisure activities.',
        predictedOutcome: 'Gradual escalation of writing frequency as positive reinforcement overrides immediate anxiety relief.',
        color: '#6366f1'
      },
      {
        id: 'cognitive',
        theoryName: 'Cognitive Restructuring',
        coreMechanism: 'Maladaptive perfectionism ("If the draft is not flawless immediately, it is a total failure") causing psychological paralysis.',
        intervention: 'Cognitive reframing to challenge absolute beliefs and deconstruct the paper into low-stakes micro-tasks.',
        predictedOutcome: 'Reduced task-initiation anxiety, improved affective self-regulation, and steady output.',
        color: '#a855f7'
      },
      {
        id: 'ebbinghaus',
        theoryName: 'Spaced Retrieval / Cognitive Load',
        coreMechanism: 'Working memory overload and lack of distributed encoding time leading to extreme mental fatigue under time pressure.',
        intervention: 'Spaced scheduling (Pomodoro blocks) and incremental consolidation over a 3-week horizon.',
        predictedOutcome: 'Sustainable long-term conceptual retention and elimination of cramming-induced stress spikes.',
        color: '#3b82f6'
      }
    ]
  },
  {
    id: 'workplace-burnout',
    title: 'Chronic Workplace Burnout & Disengagement',
    category: 'Motivation & Well-being',
    description: 'A mid-level project manager displays chronic exhaustion, cynicism, and declining performance due to a lack of agency and continuous high demands.',
    theories: [
      {
        id: 'sdt',
        theoryName: 'Self-Determination Theory',
        coreMechanism: 'Deprivation of three innate psychological needs: Autonomy, Competence, and Relatedness.',
        intervention: 'Job crafting: redesigning daily tasks to restore control over schedules and alignment with core values.',
        predictedOutcome: 'Restored intrinsic motivation, reduced emotional exhaustion, and increased organizational engagement.',
        color: '#10b981'
      },
      {
        id: 'behavioral',
        theoryName: 'Behavioral Activation',
        coreMechanism: 'Extinction of positive reinforcement from work and life activities, leading to behavioral withdrawal.',
        intervention: 'Systematically scheduling valued activities and tracking mastery/pleasure ratings daily.',
        predictedOutcome: 'Re-engagement with rewarding environmental contingencies and elevated mood stability.',
        color: '#f59e0b'
      }
    ]
  },
  {
    id: 'habit-formation',
    title: 'Adopting a Consistent Daily Exercise Habit',
    category: 'Behavioral Modification',
    description: 'An individual repeatedly resolves to work out daily but abandons the routine after five days due to low initial motivation and friction.',
    theories: [
      {
        id: 'social-learning',
        theoryName: 'Social Cognitive Theory',
        coreMechanism: 'Low perceived self-efficacy and lack of actionable observational role models or social reinforcement.',
        intervention: 'Vicarious learning via workout buddy groups and mastery modeling through scaled micro-habits.',
        predictedOutcome: 'Enhanced self-efficacy beliefs and stable habit automaticity through environmental scaffolding.',
        color: '#a0623c'
      },
      {
        id: 'operant',
        theoryName: 'Behavioral Habit Stacking',
        coreMechanism: 'Absence of stable contextual cues and immediate rewarding consequences following the behavior.',
        intervention: 'Implementation intentions ("After I pour my morning coffee [cue], I will do 10 pushups [routine]").',
        predictedOutcome: 'Automatic cue-response pairing reducing the cognitive load required to initiate exercise.',
        color: '#6366f1'
      }
    ]
  }
];