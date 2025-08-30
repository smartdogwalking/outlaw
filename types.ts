import z from "zod";

// Law School Schema
export const LawSchoolSchema = z.object({
  id: z.number(),
  name: z.string(),
  slug: z.string(),
  created_at: z.string(),
  updated_at: z.string(),
});

export type LawSchool = z.infer<typeof LawSchoolSchema>;

// Professor Schema
export const ProfessorSchema = z.object({
  id: z.number(),
  name: z.string(),
  law_school_id: z.number(),
  email: z.string().nullable(),
  department: z.string().nullable(),
  specialties: z.string().nullable(),
  teaching_style: z.string().nullable(),
  personality_traits: z.string().nullable(),
  rate_my_professor_url: z.string().nullable(),
  publications_data: z.string().nullable(),
  created_at: z.string(),
  updated_at: z.string(),
});

export type Professor = z.infer<typeof ProfessorSchema>;

// User Profile Schema (removed gamification elements)
export const UserProfileSchema = z.object({
  id: z.number(),
  user_id: z.string(),
  law_school_id: z.number().nullable(),
  year_of_study: z.number().nullable(),
  created_at: z.string(),
  updated_at: z.string(),
});

export type UserProfile = z.infer<typeof UserProfileSchema>;

// Professor Clone Schema
export const ProfessorCloneSchema = z.object({
  id: z.number(),
  user_id: z.string(),
  professor_id: z.number(),
  course_name: z.string(),
  syllabus_content: z.string().nullable(),
  lecture_notes: z.string().nullable(),
  ai_personality_prompt: z.string().nullable(),
  exam_prediction_data: z.string().nullable(),
  professor_insights: z.string().nullable(),
  communication_patterns: z.string().nullable(),
  enhanced_exam_predictions: z.string().nullable(),
  is_active: z.boolean(),
  created_at: z.string(),
  updated_at: z.string(),
  professor_name: z.string().optional(),
  school_name: z.string().optional(),
});

export type ProfessorClone = z.infer<typeof ProfessorCloneSchema>;

// Study Material Schema
export const StudyMaterialSchema = z.object({
  id: z.number(),
  professor_clone_id: z.number(),
  type: z.enum(['hypothetical', 'quiz', 'model_answer']),
  title: z.string(),
  content: z.string(),
  difficulty: z.number(),
  topic: z.string().nullable(),
  is_mastered: z.boolean(),
  last_reviewed_at: z.string().nullable(),
  review_count: z.number(),
  correct_count: z.number(),
  created_at: z.string(),
  updated_at: z.string(),
});

export type StudyMaterial = z.infer<typeof StudyMaterialSchema>;

// Study Session Schema (simplified, no gamification)
export const StudySessionSchema = z.object({
  id: z.number(),
  user_id: z.string(),
  professor_clone_id: z.number(),
  duration_minutes: z.number(),
  materials_studied: z.number(),
  session_date: z.string(),
  created_at: z.string(),
  updated_at: z.string(),
});

export type StudySession = z.infer<typeof StudySessionSchema>;

// Professor Questionnaire Response Schema
export const ProfessorQuestionnaireResponseSchema = z.object({
  id: z.number(),
  professor_clone_id: z.number(),
  teaching_philosophy: z.string().nullable(),
  grading_style: z.string().nullable(),
  communication_style: z.string().nullable(),
  humor_level: z.number().nullable(),
  strictness_level: z.number().nullable(),
  preferred_question_types: z.string().nullable(),
  common_student_mistakes: z.string().nullable(),
  legal_interpretation_style: z.string().nullable(),
  exam_format_preference: z.string().nullable(),
  feedback_style: z.string().nullable(),
  office_hours_approach: z.string().nullable(),
  case_study_emphasis: z.string().nullable(),
  theoretical_vs_practical: z.number().nullable(),
  practical_application_focus: z.number().nullable(),
  case_analysis_emphasis: z.number().nullable(),
  student_preparation_expectations: z.string().nullable(),
  technology_usage: z.string().nullable(),
  diversity_inclusion_emphasis: z.string().nullable(),
  professor_formality_level: z.number().nullable(),
  professor_age_range: z.string().nullable(),
  professor_gender: z.string().nullable(),
  professor_tenure_at_school: z.string().nullable(),
  professor_dress_style: z.string().nullable(),
  professor_uses_profanity: z.string().nullable(),
  professor_personality_type: z.string().nullable(),
  professor_teaching_energy: z.number().nullable(),
  writing_style_expectations: z.string().nullable(),
  professor_quirks_and_hints: z.string().nullable(),
  created_at: z.string(),
  updated_at: z.string(),
});

export type ProfessorQuestionnaireResponse = z.infer<typeof ProfessorQuestionnaireResponseSchema>;
