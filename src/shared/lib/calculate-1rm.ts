// Epley formula for 1RM estimation
export const calculate1RM = (weight: number, reps: number): number => {
    if (reps === 1) return weight;
    if (weight <= 0 || reps <= 0) return 0;
    return Math.round(weight * (1 + reps / 30));
};
