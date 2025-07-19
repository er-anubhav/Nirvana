(globalThis.TURBOPACK = globalThis.TURBOPACK || []).push([typeof document === "object" ? document.currentScript : undefined, {

"[project]/src/lib/supabase-logger.ts [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>__TURBOPACK__default__export__),
    "logSupabaseAuth": (()=>logSupabaseAuth),
    "logSupabaseConnection": (()=>logSupabaseConnection),
    "logSupabaseDebug": (()=>logSupabaseDebug),
    "logSupabaseError": (()=>logSupabaseError),
    "logSupabaseOperation": (()=>logSupabaseOperation),
    "logSupabaseWarning": (()=>logSupabaseWarning),
    "supabaseLogger": (()=>supabaseLogger),
    "useSupabaseLogs": (()=>useSupabaseLogs)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
class SupabaseLogger {
    logs = [];
    maxLogs = 100 // Keep only last 100 logs
    ;
    formatTimestamp() {
        return new Date().toISOString();
    }
    addLog(entry) {
        this.logs.push(entry);
        // Keep only the most recent logs
        if (this.logs.length > this.maxLogs) {
            this.logs = this.logs.slice(-this.maxLogs);
        }
        // Console output with appropriate styling
        const emoji = {
            info: 'ℹ️',
            warn: '⚠️',
            error: '❌',
            debug: '🔍'
        };
        const prefix = `${emoji[entry.level]} [SUPABASE ${entry.level.toUpperCase()}]`;
        const message = `${prefix} ${entry.operation}`;
        switch(entry.level){
            case 'error':
                console.error(message, entry.details || entry.error);
                break;
            case 'warn':
                console.warn(message, entry.details);
                break;
            case 'debug':
                console.debug(message, entry.details);
                break;
            default:
                console.log(message, entry.details);
        }
    }
    // Log successful database operations
    logOperation(operation, table, details, duration) {
        this.addLog({
            timestamp: this.formatTimestamp(),
            level: 'info',
            operation: `${operation} on ${table}`,
            table,
            duration,
            details
        });
    }
    // Log authentication events
    logAuth(event, userId, details) {
        this.addLog({
            timestamp: this.formatTimestamp(),
            level: 'info',
            operation: `Auth: ${event}`,
            userId,
            details
        });
    }
    // Log errors with context
    logError(operation, error, context) {
        this.addLog({
            timestamp: this.formatTimestamp(),
            level: 'error',
            operation: `Error: ${operation}`,
            error,
            details: context
        });
    }
    // Log warnings
    logWarning(operation, message, details) {
        this.addLog({
            timestamp: this.formatTimestamp(),
            level: 'warn',
            operation,
            details: {
                message,
                ...details
            }
        });
    }
    // Log debug information (only in development)
    logDebug(operation, details) {
        if ("TURBOPACK compile-time truthy", 1) {
            this.addLog({
                timestamp: this.formatTimestamp(),
                level: 'debug',
                operation,
                details
            });
        }
    }
    // Log connection events
    logConnection(status, details) {
        const level = status === 'failed' ? 'error' : status === 'disconnected' ? 'warn' : 'info';
        this.addLog({
            timestamp: this.formatTimestamp(),
            level,
            operation: `Connection ${status}`,
            details
        });
    }
    // Get recent logs
    getRecentLogs(count = 10) {
        return this.logs.slice(-count);
    }
    // Get logs by level
    getLogsByLevel(level) {
        return this.logs.filter((log)=>log.level === level);
    }
    // Clear logs
    clearLogs() {
        this.logs = [];
        console.log('🧹 Supabase logs cleared');
    }
    // Export logs for debugging
    exportLogs() {
        return JSON.stringify(this.logs, null, 2);
    }
    // Performance monitoring
    startTimer(operation) {
        const startTime = performance.now();
        return ()=>{
            const duration = performance.now() - startTime;
            this.logDebug(`Performance: ${operation}`, {
                duration: `${duration.toFixed(2)}ms`
            });
            return duration;
        };
    }
}
const supabaseLogger = new SupabaseLogger();
const logSupabaseOperation = (operation, table, details, duration)=>{
    supabaseLogger.logOperation(operation, table, details, duration);
};
const logSupabaseAuth = (event, userId, details)=>{
    supabaseLogger.logAuth(event, userId, details);
};
const logSupabaseError = (operation, error, context)=>{
    supabaseLogger.logError(operation, error, context);
};
const logSupabaseWarning = (operation, message, details)=>{
    supabaseLogger.logWarning(operation, message, details);
};
const logSupabaseDebug = (operation, details)=>{
    supabaseLogger.logDebug(operation, details);
};
const logSupabaseConnection = (status, details)=>{
    supabaseLogger.logConnection(status, details);
};
const useSupabaseLogs = ()=>{
    return {
        getRecentLogs: (count)=>supabaseLogger.getRecentLogs(count),
        getLogsByLevel: (level)=>supabaseLogger.getLogsByLevel(level),
        clearLogs: ()=>supabaseLogger.clearLogs(),
        exportLogs: ()=>supabaseLogger.exportLogs()
    };
};
const __TURBOPACK__default__export__ = supabaseLogger;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/lib/supabase.ts [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>__TURBOPACK__default__export__),
    "handleSupabaseError": (()=>handleSupabaseError),
    "logDatabaseOperation": (()=>logDatabaseOperation),
    "supabase": (()=>supabase),
    "validateSupabaseConnection": (()=>validateSupabaseConnection)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$supabase$2d$js$2f$dist$2f$module$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@supabase/supabase-js/dist/module/index.js [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2d$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/supabase-logger.ts [app-client] (ecmascript)");
;
;
// Environment variables
const supabaseUrl = ("TURBOPACK compile-time value", "https://ikymixbkakaxdxtlnaly.supabase.co");
const supabaseAnonKey = ("TURBOPACK compile-time value", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlreW1peGJrYWtheGR4dGxuYWx5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk0OTYwODUsImV4cCI6MjA2NTA3MjA4NX0.YBh-dcY9MrplRLSyqBh9GrZYzOyCPcccP4GfSvb04Qc");
// Validate environment variables
if ("TURBOPACK compile-time falsy", 0) {
    "TURBOPACK unreachable";
}
if ("TURBOPACK compile-time falsy", 0) {
    "TURBOPACK unreachable";
}
// Log connection attempt
(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2d$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["logSupabaseConnection"])('connecting', {
    url: supabaseUrl,
    keyPreview: supabaseAnonKey.substring(0, 20) + '...'
});
const supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$supabase$2d$js$2f$dist$2f$module$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createClient"])(supabaseUrl, supabaseAnonKey, {
    auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true
    },
    db: {
        schema: 'public'
    },
    global: {
        headers: {
            'X-Client-Info': 'Nirvana-Municipal-Platform'
        }
    }
});
const validateSupabaseConnection = async ()=>{
    try {
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2d$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["logSupabaseDebug"])('Starting connection validation');
        // Test the connection by making a simple query
        const { data, error } = await supabase.from('_health_check').select('*').limit(1);
        if (error) {
            // If health check table doesn't exist, try a different approach
            if (error.code === 'PGRST116' || error.message.includes('does not exist')) {
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2d$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["logSupabaseDebug"])('Health check table not found, testing with auth instead');
                // Test with auth session
                const { data: session, error: authError } = await supabase.auth.getSession();
                if (authError) {
                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2d$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["logSupabaseError"])('auth_connection_test', authError);
                    return false;
                }
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2d$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["logSupabaseConnection"])('connected', {
                    method: 'auth_test',
                    hasActiveSession: !!session.session
                });
                return true;
            } else {
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2d$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["logSupabaseError"])('health_check', error);
                return false;
            }
        }
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2d$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["logSupabaseConnection"])('connected', {
            method: 'health_check',
            responseData: data
        });
        return true;
    } catch (error) {
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2d$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["logSupabaseError"])('connection_validation', error);
        return false;
    }
};
// Auto-validate connection on import (only in development)
if ("TURBOPACK compile-time truthy", 1) {
    validateSupabaseConnection().then((isValid)=>{
        if (isValid) {
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2d$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["logSupabaseConnection"])('connected', {
                autoValidation: true
            });
        } else {
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2d$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["logSupabaseConnection"])('failed', {
                autoValidation: true
            });
        }
    });
}
const logDatabaseOperation = (operation, table, details)=>{
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2d$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["logSupabaseDebug"])(`Database Operation: ${operation.toUpperCase()} on ${table}`, details);
};
const handleSupabaseError = (error, context)=>{
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2d$logger$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["logSupabaseError"])(context, error);
    // Return user-friendly error message
    return {
        error: true,
        message: error.message || 'An unexpected error occurred',
        code: error.code
    };
};
const __TURBOPACK__default__export__ = supabase;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/lib/auth.ts [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "authService": (()=>authService)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/supabase.ts [app-client] (ecmascript)");
;
const authService = {
    // Login with phone number and password
    async login (phone, password) {
        try {
            // For now, we're using a common password "root" for all citizens
            if (password !== 'root') {
                return {
                    user: null,
                    error: 'Invalid password'
                };
            }
            console.log('Attempting login for phone:', phone);
            // Automatically add 91 country code if not present
            const phoneWithCountryCode = phone.startsWith('91') ? phone : `91${phone}`;
            console.log('Phone with country code:', phoneWithCountryCode);
            // Find user by phone number
            const { data: users, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from('users').select('*').eq('phone_number', phoneWithCountryCode).limit(1);
            console.log('Database query result:', {
                users,
                error
            });
            if (error) {
                console.error('Auth error:', error);
                return {
                    user: null,
                    error: `Authentication failed: ${error.message}`
                };
            }
            if (!users || users.length === 0) {
                return {
                    user: null,
                    error: 'User not found. Please check your phone number.'
                };
            }
            const user = users[0];
            console.log('Found user:', user);
            const authUser = {
                id: user.id,
                phone: user.phone_number,
                name: user.name,
                role: user.role
            };
            // Store user in localStorage for simple session management
            localStorage.setItem('currentUser', JSON.stringify(authUser));
            return {
                user: authUser,
                error: null
            };
        } catch (error) {
            console.error('Login error:', error);
            return {
                user: null,
                error: 'An unexpected error occurred'
            };
        }
    },
    // Get current authenticated user
    getCurrentUser () {
        try {
            const userStr = localStorage.getItem('currentUser');
            if (!userStr) return null;
            return JSON.parse(userStr);
        } catch  {
            return null;
        }
    },
    // Logout user
    logout () {
        localStorage.removeItem('currentUser');
    },
    // Check if user is authenticated
    isAuthenticated () {
        return this.getCurrentUser() !== null;
    }
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/lib/complaints.ts [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "complaintService": (()=>complaintService)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/supabase.ts [app-client] (ecmascript)");
;
const complaintService = {
    // Get complaints for a specific user
    async getUserComplaints (userId) {
        try {
            const { data: complaints, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from('complaints').select('*').eq('user_id', userId).order('created_at', {
                ascending: false
            });
            if (error) {
                console.error('Error fetching complaints:', error);
                return {
                    data: null,
                    error: 'Failed to fetch complaints'
                };
            }
            // Map created_at to createdAt for consistency with frontend expectations
            const complaintsWithFormattedDate = complaints?.map((complaint)=>({
                    ...complaint,
                    createdAt: complaint.created_at
                })) || [];
            return {
                data: complaintsWithFormattedDate,
                error: null
            };
        } catch (error) {
            console.error('Unexpected error:', error);
            return {
                data: null,
                error: 'An unexpected error occurred'
            };
        }
    },
    // Get all complaints (for public dashboard)
    async getAllComplaints (limit = 50) {
        try {
            const { data: complaints, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from('complaints').select('*').order('created_at', {
                ascending: false
            }).limit(limit);
            if (error) {
                console.error('Error fetching all complaints:', error);
                return {
                    data: null,
                    error: 'Failed to fetch complaints'
                };
            }
            // Map created_at to createdAt for consistency with frontend expectations
            const complaintsWithFormattedDate = complaints?.map((complaint)=>({
                    ...complaint,
                    createdAt: complaint.created_at
                })) || [];
            return {
                data: complaintsWithFormattedDate,
                error: null
            };
        } catch (error) {
            console.error('Unexpected error:', error);
            return {
                data: null,
                error: 'An unexpected error occurred'
            };
        }
    },
    // Get a single complaint by ID
    async getComplaintById (complaintId) {
        try {
            const { data: complaint, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from('complaints').select('*').eq('id', complaintId).single();
            if (error) {
                console.error('Error fetching complaint:', error);
                return {
                    data: null,
                    error: 'Failed to fetch complaint'
                };
            }
            // Map created_at to createdAt for consistency with frontend expectations
            const complaintWithFormattedDate = {
                ...complaint,
                createdAt: complaint.created_at
            };
            return {
                data: complaintWithFormattedDate,
                error: null
            };
        } catch (error) {
            console.error('Unexpected error:', error);
            return {
                data: null,
                error: 'An unexpected error occurred'
            };
        }
    },
    // Get complaint statistics for a user
    async getUserStats (userId) {
        try {
            const { data: complaints, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from('complaints').select('status').eq('user_id', userId);
            if (error) {
                console.error('Error fetching stats:', error);
                return {
                    total: 0,
                    pending: 0,
                    resolved: 0,
                    avgResolutionTime: 'N/A',
                    error: 'Failed to fetch statistics'
                };
            }
            const total = complaints.length;
            const pending = complaints.filter((c)=>c.status === 'pending' || c.status === 'in_progress').length;
            const resolved = complaints.filter((c)=>c.status === 'resolved').length;
            // Since there's no timestamp data in the schema, we'll show N/A for resolution time
            const avgResolutionTime = 'N/A';
            return {
                total,
                pending,
                resolved,
                avgResolutionTime,
                error: null
            };
        } catch (error) {
            console.error('Unexpected error:', error);
            return {
                total: 0,
                pending: 0,
                resolved: 0,
                avgResolutionTime: 'N/A',
                error: 'An unexpected error occurred'
            };
        }
    },
    // Get categories
    async getCategories () {
        try {
            const { data: categories, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from('categories').select('*').order('name');
            if (error) {
                console.error('Error fetching categories:', error);
                return {
                    data: null,
                    error: 'Failed to fetch categories'
                };
            }
            return {
                data: categories,
                error: null
            };
        } catch (error) {
            console.error('Unexpected error:', error);
            return {
                data: null,
                error: 'An unexpected error occurred'
            };
        }
    },
    // Create a new complaint
    async createComplaint (complaintData, userId) {
        try {
            const { data: complaint, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from('complaints').insert({
                title: complaintData.title,
                description: complaintData.description,
                category: complaintData.category,
                location: complaintData.location,
                user_id: userId,
                status: 'pending',
                priority: complaintData.priority || 'medium',
                location_lat: complaintData.location_lat,
                location_lng: complaintData.location_lng,
                image_url: complaintData.image_url
            }).select().single();
            if (error) {
                console.error('Error creating complaint:', error);
                return {
                    data: null,
                    error: 'Failed to create complaint'
                };
            }
            return {
                data: complaint,
                error: null
            };
        } catch (error) {
            console.error('Unexpected error:', error);
            return {
                data: null,
                error: 'An unexpected error occurred'
            };
        }
    }
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/app/citizen/gallery/page.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>ComplaintGallery)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/framer-motion/dist/es/render/components/motion/proxy.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$left$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowLeft$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/arrow-left.js [app-client] (ecmascript) <export default as ArrowLeft>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$grid$2d$3x3$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Grid3X3$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/grid-3x3.js [app-client] (ecmascript) <export default as Grid3X3>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Image$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/image.js [app-client] (ecmascript) <export default as Image>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$calendar$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Calendar$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/calendar.js [app-client] (ecmascript) <export default as Calendar>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$map$2d$pin$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MapPin$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/map-pin.js [app-client] (ecmascript) <export default as MapPin>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$external$2d$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ExternalLink$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/external-link.js [app-client] (ecmascript) <export default as ExternalLink>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/search.js [app-client] (ecmascript) <export default as Search>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$funnel$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Filter$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/funnel.js [app-client] (ecmascript) <export default as Filter>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$eye$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Eye$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/eye.js [app-client] (ecmascript) <export default as Eye>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$auth$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/auth.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$complaints$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/complaints.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
;
;
;
function ComplaintGallery() {
    _s();
    const [complaints, setComplaints] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [filteredComplaints, setFilteredComplaints] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [currentUser, setCurrentUser] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [searchTerm, setSearchTerm] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [selectedCategory, setSelectedCategory] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('all');
    const [viewMode, setViewMode] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('grid');
    const [selectedImage, setSelectedImage] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ComplaintGallery.useEffect": ()=>{
            const user = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$auth$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["authService"].getCurrentUser();
            if (!user) {
                router.push('/auth/login');
                return;
            }
            setCurrentUser(user);
            loadUserComplaints(user.id);
        }
    }["ComplaintGallery.useEffect"], [
        router
    ]);
    const loadUserComplaints = async (userId)=>{
        setLoading(true);
        try {
            const { data: complaintsData, error: complaintsError } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$complaints$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["complaintService"].getUserComplaints(userId);
            if (complaintsError) {
                setError(complaintsError);
            } else if (complaintsData) {
                // Filter complaints that have media
                const complaintsWithMedia = complaintsData.filter((complaint)=>complaint.image_url && complaint.image_url.trim() !== '').map((complaint)=>({
                        ...complaint,
                        hasMedia: true
                    }));
                setComplaints(complaintsWithMedia);
                setFilteredComplaints(complaintsWithMedia);
                console.log('Loaded complaints with media:', complaintsWithMedia);
            }
        } catch (err) {
            setError('Failed to load complaints');
            console.error('Error loading user complaints:', err);
        } finally{
            setLoading(false);
        }
    };
    // Filter and search functionality
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ComplaintGallery.useEffect": ()=>{
            let filtered = complaints;
            // Filter by category
            if (selectedCategory !== 'all') {
                filtered = filtered.filter({
                    "ComplaintGallery.useEffect": (complaint)=>complaint.category === selectedCategory
                }["ComplaintGallery.useEffect"]);
            }
            // Filter by search term
            if (searchTerm) {
                filtered = filtered.filter({
                    "ComplaintGallery.useEffect": (complaint)=>complaint.title.toLowerCase().includes(searchTerm.toLowerCase()) || complaint.description.toLowerCase().includes(searchTerm.toLowerCase())
                }["ComplaintGallery.useEffect"]);
            }
            setFilteredComplaints(filtered);
        }
    }["ComplaintGallery.useEffect"], [
        complaints,
        selectedCategory,
        searchTerm
    ]);
    const formatDate = (dateString)=>{
        return new Date(dateString).toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };
    const getStatusColor = (status)=>{
        switch(status){
            case 'pending':
                return 'bg-amber-500';
            case 'in_progress':
                return 'bg-blue-500';
            case 'resolved':
                return 'bg-emerald-500';
            case 'closed':
                return 'bg-red-500';
            default:
                return 'bg-purple-500';
        }
    };
    const getUniqueCategories = ()=>{
        const categories = [
            ...new Set(complaints.map((c)=>c.category))
        ];
        return categories;
    };
    if (loading) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "min-h-screen bg-gradient-to-br from-[#0a0613] via-[#150d27] to-[#0a0613] flex items-center justify-center",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "text-center",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "w-12 h-12 mx-auto mb-4 border-2 rounded-full border-purple-500/20 border-t-purple-500 animate-spin"
                    }, void 0, false, {
                        fileName: "[project]/src/app/citizen/gallery/page.tsx",
                        lineNumber: 121,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-purple-300",
                        children: "Loading your gallery..."
                    }, void 0, false, {
                        fileName: "[project]/src/app/citizen/gallery/page.tsx",
                        lineNumber: 122,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/citizen/gallery/page.tsx",
                lineNumber: 120,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/app/citizen/gallery/page.tsx",
            lineNumber: 119,
            columnNumber: 7
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "min-h-screen bg-gradient-to-br from-[#0a0613] via-[#150d27] to-[#0a0613]",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("nav", {
                className: "sticky top-0 z-10 p-4 border-b bg-purple-500/5 backdrop-blur-sm border-purple-500/20",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex items-center justify-between mx-auto max-w-7xl",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center space-x-4",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                    href: "/citizen/dashboard",
                                    className: "flex items-center p-2 text-purple-400 transition-colors rounded-lg hover:text-purple-300 hover:bg-purple-500/10",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$left$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowLeft$3e$__["ArrowLeft"], {
                                        className: "w-5 h-5"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/citizen/gallery/page.tsx",
                                        lineNumber: 138,
                                        columnNumber: 15
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/app/citizen/gallery/page.tsx",
                                    lineNumber: 134,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                    className: "font-serif text-2xl font-normal text-white",
                                    children: "Media Gallery"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/citizen/gallery/page.tsx",
                                    lineNumber: 140,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "text-purple-300/70",
                                    children: [
                                        filteredComplaints.length,
                                        " items"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/citizen/gallery/page.tsx",
                                    lineNumber: 141,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/citizen/gallery/page.tsx",
                            lineNumber: 133,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center space-x-4",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>setViewMode(viewMode === 'grid' ? 'masonry' : 'grid'),
                                className: "p-2 text-purple-400 transition-colors rounded-lg hover:text-purple-300 hover:bg-purple-500/10",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$grid$2d$3x3$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Grid3X3$3e$__["Grid3X3"], {
                                    className: "w-5 h-5"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/citizen/gallery/page.tsx",
                                    lineNumber: 149,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/app/citizen/gallery/page.tsx",
                                lineNumber: 145,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/app/citizen/gallery/page.tsx",
                            lineNumber: 144,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/citizen/gallery/page.tsx",
                    lineNumber: 132,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/app/citizen/gallery/page.tsx",
                lineNumber: 131,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "p-6 mx-auto max-w-7xl",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                        initial: {
                            opacity: 0,
                            y: 20
                        },
                        animate: {
                            opacity: 1,
                            y: 0
                        },
                        transition: {
                            duration: 0.6
                        },
                        className: "mb-8",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex flex-col gap-4 p-6 border lg:flex-row lg:items-center lg:justify-between bg-purple-500/5 backdrop-blur-sm border-purple-500/20 rounded-xl",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "relative flex-1 max-w-md",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__["Search"], {
                                            className: "absolute w-5 h-5 text-purple-400 left-3 top-1/2 transform -translate-y-1/2"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/citizen/gallery/page.tsx",
                                            lineNumber: 166,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                            type: "text",
                                            placeholder: "Search complaints...",
                                            value: searchTerm,
                                            onChange: (e)=>setSearchTerm(e.target.value),
                                            className: "w-full py-2 pl-10 pr-4 text-white placeholder-purple-300/50 bg-purple-950/30 border border-purple-500/30 rounded-lg focus:outline-none focus:border-purple-400"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/citizen/gallery/page.tsx",
                                            lineNumber: 167,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/citizen/gallery/page.tsx",
                                    lineNumber: 165,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-center space-x-3",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$funnel$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Filter$3e$__["Filter"], {
                                            className: "w-5 h-5 text-purple-400"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/citizen/gallery/page.tsx",
                                            lineNumber: 178,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                            value: selectedCategory,
                                            onChange: (e)=>setSelectedCategory(e.target.value),
                                            className: "px-4 py-2 text-white bg-purple-950/30 border border-purple-500/30 rounded-lg focus:outline-none focus:border-purple-400",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                    value: "all",
                                                    children: "All Categories"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/citizen/gallery/page.tsx",
                                                    lineNumber: 184,
                                                    columnNumber: 17
                                                }, this),
                                                getUniqueCategories().map((category)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                        value: category,
                                                        children: category
                                                    }, category, false, {
                                                        fileName: "[project]/src/app/citizen/gallery/page.tsx",
                                                        lineNumber: 186,
                                                        columnNumber: 19
                                                    }, this))
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/citizen/gallery/page.tsx",
                                            lineNumber: 179,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/citizen/gallery/page.tsx",
                                    lineNumber: 177,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/citizen/gallery/page.tsx",
                            lineNumber: 163,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/app/citizen/gallery/page.tsx",
                        lineNumber: 157,
                        columnNumber: 9
                    }, this),
                    error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "p-6 mb-8",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "p-4 text-center border rounded-lg border-red-500/30 bg-red-500/10",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-red-400",
                                    children: error
                                }, void 0, false, {
                                    fileName: "[project]/src/app/citizen/gallery/page.tsx",
                                    lineNumber: 197,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: ()=>currentUser && loadUserComplaints(currentUser.id),
                                    className: "px-4 py-2 mt-2 text-sm text-white transition-colors bg-red-600 rounded-lg hover:bg-red-700",
                                    children: "Retry"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/citizen/gallery/page.tsx",
                                    lineNumber: 198,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/citizen/gallery/page.tsx",
                            lineNumber: 196,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/app/citizen/gallery/page.tsx",
                        lineNumber: 195,
                        columnNumber: 11
                    }, this),
                    !error && filteredComplaints.length > 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                        initial: {
                            opacity: 0
                        },
                        animate: {
                            opacity: 1
                        },
                        transition: {
                            duration: 0.6,
                            delay: 0.2
                        },
                        className: `grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'}`,
                        children: filteredComplaints.map((complaint, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                                initial: {
                                    opacity: 0,
                                    scale: 0.9
                                },
                                animate: {
                                    opacity: 1,
                                    scale: 1
                                },
                                transition: {
                                    duration: 0.4,
                                    delay: index * 0.1
                                },
                                className: "group relative overflow-hidden border bg-purple-500/5 backdrop-blur-sm border-purple-500/20 rounded-xl hover:border-purple-400/40 transition-all duration-300",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "relative aspect-square overflow-hidden",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                                src: complaint.image_url,
                                                alt: complaint.title,
                                                className: "w-full h-full object-cover transition-transform duration-300 group-hover:scale-105",
                                                onError: (e)=>{
                                                    e.currentTarget.src = '/no-image.png';
                                                }
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/citizen/gallery/page.tsx",
                                                lineNumber: 230,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "absolute top-3 left-3",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: `px-2 py-1 rounded-full text-xs font-medium text-white ${getStatusColor(complaint.status)}`,
                                                    children: complaint.status.replace('-', ' ').toUpperCase()
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/citizen/gallery/page.tsx",
                                                    lineNumber: 241,
                                                    columnNumber: 21
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/citizen/gallery/page.tsx",
                                                lineNumber: 240,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex space-x-3",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                            onClick: ()=>setSelectedImage(complaint.image_url),
                                                            className: "p-2 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30 transition-colors",
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$eye$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Eye$3e$__["Eye"], {
                                                                className: "w-5 h-5"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/citizen/gallery/page.tsx",
                                                                lineNumber: 253,
                                                                columnNumber: 25
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/citizen/gallery/page.tsx",
                                                            lineNumber: 249,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                            href: `/citizen/complaints/${complaint.id}`,
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                className: "p-2 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30 transition-colors",
                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$external$2d$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ExternalLink$3e$__["ExternalLink"], {
                                                                    className: "w-5 h-5"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/citizen/gallery/page.tsx",
                                                                    lineNumber: 257,
                                                                    columnNumber: 27
                                                                }, this)
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/citizen/gallery/page.tsx",
                                                                lineNumber: 256,
                                                                columnNumber: 25
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/citizen/gallery/page.tsx",
                                                            lineNumber: 255,
                                                            columnNumber: 23
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/app/citizen/gallery/page.tsx",
                                                    lineNumber: 248,
                                                    columnNumber: 21
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/citizen/gallery/page.tsx",
                                                lineNumber: 247,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/citizen/gallery/page.tsx",
                                        lineNumber: 229,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "p-4",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                className: "text-white font-medium mb-2 line-clamp-2 group-hover:text-purple-300 transition-colors",
                                                children: complaint.title
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/citizen/gallery/page.tsx",
                                                lineNumber: 266,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex items-center justify-between text-sm text-purple-300/70 mb-3",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "flex items-center",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$calendar$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Calendar$3e$__["Calendar"], {
                                                            className: "w-4 h-4 mr-1"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/citizen/gallery/page.tsx",
                                                            lineNumber: 272,
                                                            columnNumber: 23
                                                        }, this),
                                                        formatDate(complaint.createdAt)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/app/citizen/gallery/page.tsx",
                                                    lineNumber: 271,
                                                    columnNumber: 21
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/citizen/gallery/page.tsx",
                                                lineNumber: 270,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex items-center text-sm text-purple-300/70",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$map$2d$pin$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MapPin$3e$__["MapPin"], {
                                                        className: "w-4 h-4 mr-1"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/citizen/gallery/page.tsx",
                                                        lineNumber: 278,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "truncate",
                                                        children: complaint.category
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/citizen/gallery/page.tsx",
                                                        lineNumber: 279,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/citizen/gallery/page.tsx",
                                                lineNumber: 277,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                href: `/citizen/complaints/${complaint.id}`,
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    className: "w-full mt-4 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm rounded-lg transition-colors",
                                                    children: "View Complaint"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/citizen/gallery/page.tsx",
                                                    lineNumber: 284,
                                                    columnNumber: 21
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/citizen/gallery/page.tsx",
                                                lineNumber: 283,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/citizen/gallery/page.tsx",
                                        lineNumber: 265,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, complaint.id, true, {
                                fileName: "[project]/src/app/citizen/gallery/page.tsx",
                                lineNumber: 221,
                                columnNumber: 15
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/src/app/citizen/gallery/page.tsx",
                        lineNumber: 210,
                        columnNumber: 11
                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                        initial: {
                            opacity: 0,
                            y: 20
                        },
                        animate: {
                            opacity: 1,
                            y: 0
                        },
                        transition: {
                            duration: 0.6
                        },
                        className: "p-12 text-center border bg-purple-500/5 backdrop-blur-sm border-purple-500/20 rounded-xl",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Image$3e$__["Image"], {
                                className: "w-16 h-16 mx-auto mb-4 text-purple-400"
                            }, void 0, false, {
                                fileName: "[project]/src/app/citizen/gallery/page.tsx",
                                lineNumber: 299,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                className: "mb-2 text-xl font-medium text-white",
                                children: "No Media Found"
                            }, void 0, false, {
                                fileName: "[project]/src/app/citizen/gallery/page.tsx",
                                lineNumber: 300,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "mb-6 text-purple-300/70",
                                children: searchTerm || selectedCategory !== 'all' ? "No complaints match your current filters." : "You haven't submitted any complaints with media yet."
                            }, void 0, false, {
                                fileName: "[project]/src/app/citizen/gallery/page.tsx",
                                lineNumber: 301,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex flex-col gap-3 sm:flex-row sm:justify-center",
                                children: [
                                    (searchTerm || selectedCategory !== 'all') && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>{
                                            setSearchTerm('');
                                            setSelectedCategory('all');
                                        },
                                        className: "px-6 py-3 text-purple-300 border border-purple-500/30 rounded-lg hover:bg-purple-500/10 transition-colors",
                                        children: "Clear Filters"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/citizen/gallery/page.tsx",
                                        lineNumber: 309,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                        href: "/citizen/report",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            className: "px-6 py-3 text-white bg-purple-600 rounded-lg hover:bg-purple-700 transition-colors",
                                            children: "Report New Complaint"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/citizen/gallery/page.tsx",
                                            lineNumber: 320,
                                            columnNumber: 17
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/citizen/gallery/page.tsx",
                                        lineNumber: 319,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/citizen/gallery/page.tsx",
                                lineNumber: 307,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/citizen/gallery/page.tsx",
                        lineNumber: 293,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/citizen/gallery/page.tsx",
                lineNumber: 155,
                columnNumber: 7
            }, this),
            selectedImage && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                initial: {
                    opacity: 0
                },
                animate: {
                    opacity: 1
                },
                className: "fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm",
                onClick: ()=>setSelectedImage(null),
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                    initial: {
                        scale: 0.9
                    },
                    animate: {
                        scale: 1
                    },
                    className: "relative max-w-4xl max-h-[90vh] overflow-hidden rounded-xl",
                    onClick: (e)=>e.stopPropagation(),
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                            src: selectedImage,
                            alt: "Selected complaint",
                            className: "w-full h-full object-contain",
                            onError: (e)=>{
                                e.currentTarget.src = '/no-image.png';
                            }
                        }, void 0, false, {
                            fileName: "[project]/src/app/citizen/gallery/page.tsx",
                            lineNumber: 343,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: ()=>setSelectedImage(null),
                            className: "absolute top-4 right-4 p-2 bg-black/50 backdrop-blur-sm rounded-full text-white hover:bg-black/70 transition-colors",
                            children: "✕"
                        }, void 0, false, {
                            fileName: "[project]/src/app/citizen/gallery/page.tsx",
                            lineNumber: 351,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/citizen/gallery/page.tsx",
                    lineNumber: 337,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/app/citizen/gallery/page.tsx",
                lineNumber: 331,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/citizen/gallery/page.tsx",
        lineNumber: 129,
        columnNumber: 5
    }, this);
}
_s(ComplaintGallery, "My2DqOWOyueoDH9Uo/NsHgyy2uA=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"]
    ];
});
_c = ComplaintGallery;
var _c;
__turbopack_context__.k.register(_c, "ComplaintGallery");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
}]);

//# sourceMappingURL=src_17ba268e._.js.map