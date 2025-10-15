import React, { useState, useRef, useEffect } from 'react';
import { MoreHorizontal, Edit, UserX, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const statusStyles = { 
    Active: 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300', 
    Suspended: 'bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-300' 
};

const UserList = ({ users, selectedUsers, setSelectedUsers, onEdit, onSuspend, onDelete }) => {
    const [openMenuId, setOpenMenuId] = useState(null);
    const menuRef = useRef(null);

    const handleSelectAll = (e) => {
        if (e.target.checked) {
            setSelectedUsers(users.map(u => u.id));
        } else {
            setSelectedUsers([]);
        }
    };
    
    const handleSelectOne = (e, id) => {
        if (e.target.checked) {
            setSelectedUsers([...selectedUsers, id]);
        } else {
            setSelectedUsers(selectedUsers.filter(userId => userId !== id));
        }
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setOpenMenuId(null);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    if (users.length === 0) {
        return (
            <div className="h-full bg-card border border-border/70 rounded-xl shadow-sm flex items-center justify-center">
                <p className="text-muted-foreground">No users found for this filter.</p>
            </div>
        );
    }

    return (
        <div className="h-full bg-card border border-border/70 rounded-xl shadow-sm overflow-hidden">
            {/* --- Desktop Table View --- */}
            <div className="hidden md:block h-full overflow-auto">
                <table className="w-full text-left">
                    <thead className="sticky top-0 bg-muted/80 backdrop-blur-sm text-sm text-muted-foreground z-10">
                        <tr>
                            <th className="p-4 w-12"><input type="checkbox" onChange={handleSelectAll} checked={selectedUsers.length === users.length && users.length > 0} className="form-checkbox rounded"/></th>
                            <th className="p-4">User</th>
                            <th className="p-4">Email</th>
                            <th className="p-4">Role</th>
                            <th className="p-4">Phone Number</th>
                            <th className="p-4">Status</th>
                            <th className="p-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        {users.map(user => (
                            <tr key={user._id}>
                                <td className="p-4"><input type="checkbox" checked={selectedUsers.includes(user._id)} onChange={e => handleSelectOne(e, user._id)} className="form-checkbox rounded"/></td>
                                <td className="p-4"><div className="flex items-center gap-3"><img src={user.profilePicture || "https://via.placeholder.com/100"} className="w-10 h-10 rounded-full object-cover"/><p className="font-bold text-foreground">{user.name}</p></div></td>
                                <td className="p-4 text-muted-foreground">{user.email}</td>
                                <td className="p-4 text-muted-foreground">{user.role}</td>
                                <td className="p-4 text-muted-foreground">{user.phoneNumber || 'N/A'}</td>
                                <td className="p-4"><span className={`text-xs font-semibold px-2 py-1 rounded-full ${statusStyles[user.status]}`}>{user.status}</span></td>
                                <td className="p-4 text-right">
                                    <div className="relative inline-block" ref={openMenuId === user._id ? menuRef : null}>
                                        <button onClick={() => setOpenMenuId(openMenuId === user._id ? null : user._id)} className="p-1 hover:bg-muted rounded-full text-muted-foreground"><MoreHorizontal size={18}/></button>
                                        <AnimatePresence>
                                        {openMenuId === user._id && (
                                            <motion.div initial={{opacity:0, scale:0.9}} animate={{opacity:1, scale:1}} exit={{opacity:0, scale:0.9}} className="absolute right-0 mt-2 w-36 bg-card border border-border rounded-md shadow-lg z-20">
                                                <div className="p-1">
                                                    <button onClick={() => {onEdit(user); setOpenMenuId(null);}} className="flex items-center gap-2 w-full text-left px-3 py-1.5 text-sm rounded hover:bg-muted"><Edit size={14}/> Edit</button>
                                                    <button onClick={() => {onSuspend(user._id); setOpenMenuId(null);}} className="flex items-center gap-2 w-full text-left px-3 py-1.5 text-sm rounded hover:bg-muted"><UserX size={14}/> Suspend</button>
                                                    <button onClick={() => {onDelete(user._id); setOpenMenuId(null);}} className="flex items-center gap-2 w-full text-left px-3 py-1.5 text-sm rounded text-red-500 hover:bg-muted"><Trash2 size={14}/> Delete</button>
                                                </div>
                                            </motion.div>
                                        )}
                                        </AnimatePresence>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            
            {/* --- Mobile Card View --- */}
            <div className="md:hidden h-full overflow-auto">
                 <div className="flex items-center p-4 border-b border-border bg-muted/80 sticky top-0 z-10">
                     <input type="checkbox" onChange={handleSelectAll} checked={selectedUsers.length === users.length && users.length > 0} className="form-checkbox rounded mr-4"/>
                     <span className="text-sm font-semibold text-muted-foreground">Select All ({selectedUsers.length} selected)</span>
                 </div>
                {users.map(user => (
                     <div key={user._id} className="border-b border-border p-4 flex items-start gap-4">
                        <input type="checkbox" checked={selectedUsers.includes(user._id)} onChange={e => handleSelectOne(e, user._id)} className="form-checkbox rounded mt-1"/>
                        <img src={user.profilePicture || "https://via.placeholder.com/100"} className="w-10 h-10 rounded-full object-cover"/>
                        <div className="flex-1">
                            <p className="font-bold text-foreground">{user.name}</p>
                            <p className="text-xs text-muted-foreground">ID: {user._id.slice(-6)} • {user.role}</p>
                             <div className="mt-2">
                                <span className={`text-xs font-semibold px-2 py-1 rounded-full ${statusStyles[user.status]}`}>{user.status}</span>
                            </div>
                        </div>
                        <div className="relative" ref={openMenuId === user._id ? menuRef : null}>
                            <button onClick={() => setOpenMenuId(openMenuId === user._id ? null : user._id)} className="p-1 hover:bg-muted rounded-full text-muted-foreground"><MoreHorizontal size={18}/></button>
                            <AnimatePresence>
                            {openMenuId === user._id && (
                                <motion.div initial={{opacity:0, scale:0.9}} animate={{opacity:1, scale:1}} exit={{opacity:0, scale:0.9}} className="absolute right-0 mt-2 w-36 bg-card border border-border rounded-md shadow-lg z-20">
                                    <div className="p-1">
                                        <button onClick={() => {onEdit(user); setOpenMenuId(null);}} className="flex items-center gap-2 w-full text-left px-3 py-1.5 text-sm rounded hover:bg-muted"><Edit size={14}/> Edit</button>
                                        <button onClick={() => {onSuspend(user._id); setOpenMenuId(null);}} className="flex items-center gap-2 w-full text-left px-3 py-1.5 text-sm rounded hover:bg-muted"><UserX size={14}/> Suspend</button>
                                        <button onClick={() => {onDelete(user._id); setOpenMenuId(null);}} className="flex items-center gap-2 w-full text-left px-3 py-1.5 text-sm rounded text-red-500 hover:bg-muted"><Trash2 size={14}/> Delete</button>
                                    </div>
                                </motion.div>
                            )}
                            </AnimatePresence>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default UserList;