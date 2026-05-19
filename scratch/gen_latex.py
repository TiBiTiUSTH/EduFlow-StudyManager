import os

routes = [
    ("Admin", "GET", "/api/admin/logs", "View system logs"),
    ("Admin", "GET", "/api/admin/settings", "View system settings"),
    ("Admin", "GET", "/api/admin/stats", "Check system statistics"),
    ("Admin", "GET", "/api/admin/system-health", "Check server health status"),
    ("Admin", "POST", "/api/admin/cleanup", "Clean old database records"),
    ("Admin", "POST", "/api/admin/settings", "Update system settings"),
    ("AI Tools", "DELETE", "/api/ai/history", "Clear AI chat history"),
    ("AI Tools", "DELETE", "/api/ai/threads/{thread_id}", "Delete specific AI thread"),
    ("AI Tools", "GET", "/api/ai/history", "Get AI chat history"),
    ("AI Tools", "GET", "/api/ai/insights", "Get AI study insights"),
    ("AI Tools", "GET", "/api/ai/task-chat-history", "Get task-specific AI chat history"),
    ("AI Tools", "GET", "/api/ai/threads", "Get all AI threads"),
    ("AI Tools", "POST", "/api/ai/auto-schedule", "Automatically schedule tasks using AI"),
    ("AI Tools", "POST", "/api/ai/breakdown-task", "Break down a large task using AI"),
    ("AI Tools", "POST", "/api/ai/chat", "Send a message to AI assistant"),
    ("AI Tools", "POST", "/api/ai/practice-subtask", "Generate practice exercises using AI"),
    ("AI Tools", "POST", "/api/ai/study-chat", "Study-focused AI chat"),
    ("AI Tools", "POST", "/api/ai/study-subtask", "Generate study subtasks"),
    ("AI Tools", "POST", "/api/ai/upload-doc", "Upload document for AI analysis"),
    ("Auth", "POST", "/api/auth/forgot-password", "Request password reset email"),
    ("Auth", "POST", "/api/auth/login", "User login to get access token"),
    ("Auth", "POST", "/api/auth/register", "Register a new user account"),
    ("Auth", "POST", "/api/auth/reset-password", "Reset user password with token"),
    ("Auth", "POST", "/api/auth/verify-otp", "Verify email with OTP code"),
    ("Buddies", "DELETE", "/api/buddies/{buddy_id}", "Remove a study buddy"),
    ("Buddies", "GET", "/api/buddies/browse", "Browse suggested study partners"),
    ("Buddies", "GET", "/api/buddies/my-buddies", "List current study buddies"),
    ("Buddies", "GET", "/api/buddies/requests", "List pending buddy requests"),
    ("Buddies", "POST", "/api/buddies/request/{target_user_id}", "Send a buddy request"),
    ("Buddies", "PUT", "/api/buddies/request/{request_id}/accept", "Accept buddy request"),
    ("Buddies", "PUT", "/api/buddies/request/{request_id}/reject", "Reject buddy request"),
    ("Chat Rooms", "GET", "/api/chat/room/{room_id}/messages", "Get messages from a room"),
    ("Chat Rooms", "POST", "/api/chat/room/{room_id}/send", "Send a message to a room"),
    ("Community", "DELETE", "/api/community/channels/{channel_id}", "Delete a channel"),
    ("Community", "DELETE", "/api/community/channels/{channel_id}/members/{member_id}", "Remove member from channel"),
    ("Community", "DELETE", "/api/community/channels/{channel_id}/messages/{message_id}", "Delete channel message"),
    ("Community", "GET", "/api/community/channels", "List community channels"),
    ("Community", "GET", "/api/community/channels/{channel_id}/join-requests", "View channel join requests"),
    ("Community", "GET", "/api/community/channels/{channel_id}/members", "List channel members"),
    ("Community", "GET", "/api/community/channels/{channel_id}/messages", "Get channel messages"),
    ("Community", "POST", "/api/community/channels/create", "Create a new channel"),
    ("Community", "POST", "/api/community/channels/{channel_id}/join", "Join a channel"),
    ("Community", "POST", "/api/community/channels/{channel_id}/leave", "Leave a channel"),
    ("Community", "POST", "/api/community/channels/{channel_id}/messages", "Send message to channel"),
    ("Community", "POST", "/api/community/channels/{channel_id}/upload", "Upload file to channel"),
    ("Community", "PUT", "/api/community/channels/{channel_id}/join-requests/{request_id}/accept", "Accept channel join request"),
    ("Community", "PUT", "/api/community/channels/{channel_id}/join-requests/{request_id}/reject", "Reject channel join request"),
    ("Direct Msgs", "GET", "/api/dm/conversations", "List direct message conversations"),
    ("Direct Msgs", "GET", "/api/dm/{buddy_id}/messages", "Get messages with a buddy"),
    ("Direct Msgs", "POST", "/api/dm/{buddy_id}/send", "Send direct message to buddy"),
    ("Direct Msgs", "POST", "/api/dm/{buddy_id}/upload", "Upload file in direct message"),
    ("Matching", "GET", "/api/matching/suggestions", "Get AI matching suggestions"),
    ("Notifications", "DELETE", "/api/notifications/{notification_id}", "Delete a notification"),
    ("Notifications", "GET", "/api/notifications/", "Get user notifications"),
    ("Notifications", "PUT", "/api/notifications/read-all", "Mark all notifications as read"),
    ("Notifications", "PUT", "/api/notifications/{notification_id}/read", "Mark notification as read"),
    ("Notifications", "WS", "/api/notifications/ws/{token}", "WebSocket for live notifications"),
    ("Pomodoro", "GET", "/api/pomodoros/stats", "Get Pomodoro study statistics"),
    ("Pomodoro", "POST", "/api/pomodoros/", "Save a completed Pomodoro session"),
    ("Resources", "DELETE", "/api/resources/{resource_id}", "Delete a resource file"),
    ("Resources", "GET", "/api/resources/", "List user resources"),
    ("Resources", "GET", "/api/resources/{resource_id}/download", "Download a resource file"),
    ("Resources", "POST", "/api/resources/upload", "Upload a new resource file"),
    ("Rooms", "DELETE", "/api/room/{room_id}", "Delete a study room"),
    ("Rooms", "GET", "/api/room/my-rooms", "List my study rooms"),
    ("Rooms", "GET", "/api/room/public", "List public study rooms"),
    ("Rooms", "GET", "/api/room/{room_id}", "Get study room details"),
    ("Rooms", "GET", "/api/room/{room_id}/members", "List members in a room"),
    ("Rooms", "POST", "/api/room/create", "Create a new study room"),
    ("Rooms", "POST", "/api/room/join/{code}", "Join a study room via code"),
    ("Rooms", "POST", "/api/room/{room_id}/leave", "Leave a study room"),
    ("Schedules", "DELETE", "/api/schedules/{schedule_id}", "Delete a schedule entry"),
    ("Schedules", "GET", "/api/schedules/", "Get user schedules"),
    ("Schedules", "POST", "/api/schedules/", "Create a new schedule entry"),
    ("Schedules", "PUT", "/api/schedules/{schedule_id}", "Update a schedule entry"),
    ("Subjects", "DELETE", "/api/subjects/{subject_id}", "Delete a subject"),
    ("Subjects", "DELETE", "/api/subjects/{subject_id}/files/{file_name}", "Delete subject file"),
    ("Subjects", "GET", "/api/subjects/", "List all user subjects"),
    ("Subjects", "GET", "/api/subjects/{subject_id}", "Get subject details"),
    ("Subjects", "GET", "/api/subjects/{subject_id}/files", "List files for a subject"),
    ("Subjects", "GET", "/api/subjects/{subject_id}/files/{file_name}/download", "Download subject file"),
    ("Subjects", "POST", "/api/subjects/", "Create a new subject"),
    ("Subjects", "POST", "/api/subjects/{subject_id}/upload", "Upload file to subject"),
    ("Subjects", "PUT", "/api/subjects/{subject_id}", "Update a subject"),
    ("Tasks", "DELETE", "/api/tasks/groups/{group_id}", "Delete a task group"),
    ("Tasks", "DELETE", "/api/tasks/{task_id}", "Delete a task"),
    ("Tasks", "GET", "/api/tasks/", "List user tasks"),
    ("Tasks", "GET", "/api/tasks/groups", "List task groups"),
    ("Tasks", "POST", "/api/tasks/", "Create a new task"),
    ("Tasks", "POST", "/api/tasks/groups", "Create a task group"),
    ("Tasks", "POST", "/api/tasks/{task_id}/review", "Log task review session"),
    ("Tasks", "POST", "/api/tasks/{task_id}/upload", "Upload file for task"),
    ("Tasks", "PUT", "/api/tasks/{task_id}", "Update task details"),
    ("Users", "DELETE", "/api/users/me", "Delete user account"),
    ("Users", "GET", "/api/users/me", "Get current user profile"),
    ("Users", "POST", "/api/users/avatar", "Upload user avatar"),
    ("Users", "POST", "/api/users/verify-password", "Verify user password"),
    ("Users", "PUT", "/api/users/me", "Update user profile"),
    ("WebRTC", "GET", "/api/video_signaling/check-permission/{room_id}/{user_id}", "Check WebRTC call permission")
]

latex_content = r'''\begin{longtable}{|p{2.8cm}|p{6cm}|p{4.5cm}|}
\caption{Comprehensive API Endpoints of EduFlow} \label{tab:api_endpoints} \\

\hline \multicolumn{1}{|c|}{\textbf{Category}} & \multicolumn{1}{c|}{\textbf{Endpoint}} & \multicolumn{1}{c|}{\textbf{Description}} \\ \hline 
\endfirsthead

\multicolumn{3}{c}%
{{\bfseries \tablename\ \thetable{} -- continued from previous page}} \\
\hline \multicolumn{1}{|c|}{\textbf{Category}} & \multicolumn{1}{c|}{\textbf{Endpoint}} & \multicolumn{1}{c|}{\textbf{Description}} \\ \hline 
\endhead

\hline \multicolumn{3}{|r|}{{Continued on next page}} \\ \hline
\endfoot

\hline
\endlastfoot

'''

for category, method, path, desc in routes:
    path = path.replace("_", "\\_")
    desc = desc.replace("_", "\\_")
    latex_content += f"\\textbf{{{category}}} & \\texttt{{{method} {path}}} & {desc}. \\\\ \\hline\n"

latex_content += r"\end{longtable}"

with open("scratch/api_table.tex", "w") as f:
    f.write(latex_content)
