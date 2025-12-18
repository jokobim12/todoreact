import { useTodoStore } from "../store/useStore";

const INTERVALS = [
    { key: '2d', ms: 48 * 60 * 60 * 1000, label: '2 hari' },
    { key: '1d', ms: 24 * 60 * 60 * 1000, label: '1 hari' },
    { key: '12h', ms: 12 * 60 * 60 * 1000, label: '12 jam' },
    { key: '6h', ms: 6 * 60 * 60 * 1000, label: '6 jam' },
    { key: '3h', ms: 3 * 60 * 60 * 1000, label: '3 jam' },
    { key: '1h', ms: 1 * 60 * 60 * 1000, label: '1 jam' },
];

export function startReminderService() {
    setInterval(() => {
        checkReminders();
    }, 60000); // Check every 1 minute
}

async function checkReminders() {
    const { todos, settings, markReminderSent } = useTodoStore.getState();

    if (!settings.fonnteToken || !settings.targetPhone) return;

    const now = Date.now();

    for (const todo of todos) {
        if (todo.completed || !todo.deadline) continue;

        const timeLeft = todo.deadline - now;
        if (timeLeft < 0) continue; // Already passed

        for (const interval of INTERVALS) {
            // Check if we are within the window (e.g., reached 2 days left) 
            // Logic: if timeLeft <= interval.ms AND we haven't sent this specific reminder yet
            // Add a buffer to prevent sending if it's WAY past that point (e.g. created a task that expires in 1 min, shouldn't trigger '2d' reminder immediately)
            // But for simplicity, we just check if timeLeft is LESS than the interval threshold.
            
            // Refined Logic: Triggers when timeLeft drops BELOW the threshold
            if (timeLeft <= interval.ms && !todo.remindersSent[interval.key]) {
                 // Send Message
                 const message = `*Pengingat Tugas*\n\nTugas: *${todo.title}*\nDeadline: ${new Date(todo.deadline).toLocaleString('id-ID')}\nSisa Waktu: < ${interval.label}\n\nSegera selesaikan!`;
                 
                 const success = await sendWhatsApp(settings.targetPhone, message, settings.fonnteToken);
                 
                 if (success) {
                     markReminderSent(todo.id, interval.key);
                     console.log(`Reminder sent for ${todo.title} (${interval.key})`);
                 }
            }
        }
    }
}

export async function sendWhatsApp(target: string, message: string, token: string): Promise<boolean> {
    try {
        const formData = new FormData();
        formData.append('target', target);
        formData.append('message', message);
        // Fonnte might require 'countryCode' if target doesn't have it, but usually standard is fine.
        
        console.log(`Attempting to send WA to ${target} with token ${token.slice(0,5)}...`);

        const response = await fetch('https://api.fonnte.com/send', {
            method: 'POST',
            headers: {
                'Authorization': token,
            },
            body: formData
        });

        const data = await response.json();
        console.log('Fonnte Response:', data);
        
        return data.status === true || (data.detail && typeof data.detail === 'string' && data.detail.includes("sent")) || (data.start && data.end); 
    } catch (error) {
        console.error('Failed to send WhatsApp:', error);
        return false;
    }
}
