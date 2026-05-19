import re

# CommunityPage.jsx
with open('frontend/pages/student/CommunityPage.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

replacements = [
    ('buddies', 'friends'),
    ('setBuddies', 'setFriends'),
    ('selectedBuddy', 'selectedFriend'),
    ('setSelectedBuddy', 'setSelectedFriend'),
    ('selectedBuddyRef', 'selectedFriendRef'),
    ('showRemoveBuddyConfirm', 'showRemoveFriendConfirm'),
    ('setShowRemoveBuddyConfirm', 'setShowRemoveFriendConfirm'),
    ('fetchBuddies', 'fetchFriends'),
    ('sendBuddyRequestFromGroup', 'sendFriendRequestFromGroup'),
    ('removeBuddy', 'removeFriend'),
    ('executeRemoveBuddy', 'executeRemoveFriend'),
    ('isBuddy', 'isFriend'),
    ('/api/buddies/', '/api/friends/'),
    ('buddy_id', 'friend_id'),
    ('buddy_name', 'friend_name'),
    ('buddy_avatar', 'friend_avatar'),
]

for old, new in replacements:
    content = content.replace(old, new)

with open('frontend/pages/student/CommunityPage.jsx', 'w', encoding='utf-8') as f:
    f.write(content)
print('CommunityPage.jsx done')

# MatchingPage.jsx
with open('frontend/pages/student/MatchingPage.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace('sendBuddyRequest', 'sendFriendRequest')
content = content.replace('/api/buddies/', '/api/friends/')

with open('frontend/pages/student/MatchingPage.jsx', 'w', encoding='utf-8') as f:
    f.write(content)
print('MatchingPage.jsx done')

# NotificationCenter.jsx
with open('frontend/components/Layout/NotificationCenter.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace('buddy_request', 'friend_request')
content = content.replace('buddy_accepted', 'friend_accepted')

with open('frontend/components/Layout/NotificationCenter.jsx', 'w', encoding='utf-8') as f:
    f.write(content)
print('NotificationCenter.jsx done')

# IncomingCallPopup.jsx  
with open('frontend/components/video/IncomingCallPopup.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace("Study Buddy", "Study Friend")

with open('frontend/components/video/IncomingCallPopup.jsx', 'w', encoding='utf-8') as f:
    f.write(content)
print('IncomingCallPopup.jsx done')
