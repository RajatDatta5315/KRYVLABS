import { Command } from 'cmdk';
import { Bot, LogOut, Search } from 'lucide-react';
import React, { useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useNavigate } from 'react-router-dom';

export function CommandK() {
    const [open, setOpen] = React.useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setOpen((open) => !open);
            }
        };
        document.addEventListener('keydown', onKeyDown);
        return () => document.removeEventListener('keydown', onKeyDown);
    }, []);

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        navigate('/auth');
    };

    return (
        <Command.Dialog open={open} onOpenChange={setOpen} label="Global Command Menu">
            <Command.Input placeholder="Type a command or search..." />
            <Command.List>
                <Command.Empty>No results found.</Command.Empty>
                <Command.Group heading="Actions">
                    <Command.Item onSelect={() => console.log('Creating new agent...')}>
                        <Bot className="mr-2 h-4 w-4" />
                        <span>Create New Agent</span>
                    </Command.Item>
                    <Command.Item onSelect={handleSignOut}>
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>Log Out</span>
                    </Command.Item>
                </Command.Group>
            </Command.List>
        </Command.Dialog>
    );
}
