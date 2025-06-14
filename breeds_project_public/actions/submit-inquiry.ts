'use server'; 

import { InquirySchema } from "@/lib/zod-schema"; 
import { prisma } from "@/lib/prismaClient"; 

export type ActionResult = { success: boolean; errors: null;} | { success: false; errors: Record<string, string[]>;} 
export async function submitInquiry(
    prevState : ActionResult, 
    formData : FormData) : Promise<ActionResult> { 
        const raw = { 
            name: formData.get('name')?.toString(), 
            email: formData.get('email')?.toString(), 
            subject: formData.get('subject')?.toString(), 
            message: formData.get('message')?.toString(), 
        }; 
        
        const result = InquirySchema.safeParse(raw); 
        if (!result.success) { 
            return { 
                success: false, 
                errors: result.error.flatten().fieldErrors, 
            }; 
        } try { 
            
            await prisma.inquiry.create({ 
                data: result.data, 
            }); 
            
            return { 
                success: true, 
                errors: null }; 
            } catch (error) { 
                console.error("Error submitting inquiry:", error); 
                return { 
                    success: false, 
                    errors: { global: ["Failed to submit inquiry. Please try again later."] }, 
                }; 
            } 
        }