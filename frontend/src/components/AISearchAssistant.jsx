import React, { useState } from 'react';
import { aiAPI } from '../services/api';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Loader2, Bot, ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '../lib/utils';

const AISearchAssistant = ({ onSearchResults, currentFilters }) => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showAssistant, setShowAssistant] = useState(false);
  const [conversation, setConversation] = useState([]);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError(null);

    const userMessage = { type: 'user', text: query };
    setConversation(prev => [...prev, userMessage]);

    try {
      const aiResponse = await aiAPI.search(query);
      
      if (aiResponse.success && aiResponse.data) {
        const { filters, explanation } = aiResponse.data;
        
        setConversation(prev => [...prev, {
          type: 'ai',
          text: explanation || 'I\'ve processed your search query.',
          filters: filters
        }]);

        const cleanedFilters = {};
        Object.keys(filters).forEach(key => {
          if (filters[key] !== null && filters[key] !== '' && 
              !(Array.isArray(filters[key]) && filters[key].length === 0)) {
            cleanedFilters[key] = filters[key];
          }
        });

        onSearchResults({
          ...currentFilters,
          ...cleanedFilters
        });

        setQuery('');
      } else {
        throw new Error(aiResponse.error || 'Unable to process your search. Please try again.');
      }
    } catch (err) {
      const errorMessage = err.response?.data?.error || err.message || 'Unable to process your search. Please try again.';
      setError(errorMessage);
      setConversation(prev => [...prev, {
        type: 'error',
        text: errorMessage
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setQuery('');
    setError(null);
    setConversation([]);
    onSearchResults({
      search: '',
      cuisine: '',
      isVegetarian: '',
      maxPrepTime: '',
      difficulty: '',
      ingredient: '',
      tags: []
    });
  };

  return (
    <Card className="mb-6">
      <CardHeader 
        className="cursor-pointer"
        onClick={() => setShowAssistant(!showAssistant)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bot className="h-5 w-5" />
            <CardTitle>Smart Search</CardTitle>
          </div>
          {showAssistant ? (
            <ChevronUp className="h-5 w-5" />
          ) : (
            <ChevronDown className="h-5 w-5" />
          )}
        </div>
      </CardHeader>

      {showAssistant && (
        <CardContent className="space-y-4">
          {conversation.length > 0 && (
            <div className="space-y-3 max-h-64 overflow-y-auto p-4 bg-muted rounded-md">
              {conversation.map((msg, index) => (
                <div
                  key={index}
                  className={cn(
                    "text-sm",
                    msg.type === 'user' && "text-muted-foreground",
                    msg.type === 'error' && "text-destructive"
                  )}
                >
                  <span className="font-medium">{msg.type === 'user' ? 'You' : 'AI'}: </span>
                  {msg.text}
                </div>
              ))}
            </div>
          )}

          <form onSubmit={handleSearch} className="flex gap-2">
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ask me anything... e.g., 'Show me easy vegetarian recipes'"
              disabled={loading}
              className="flex-1"
            />
            <Button type="submit" disabled={loading || !query.trim()}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Searching...
                </>
              ) : (
                'Search'
              )}
            </Button>
          </form>

          {error && (
            <div className="p-3 bg-destructive/10 text-destructive rounded-md text-sm">
              {error}
            </div>
          )}

          {conversation.length > 0 && (
            <Button variant="outline" onClick={handleClear} className="w-full">
              Clear Conversation
            </Button>
          )}
        </CardContent>
      )}
    </Card>
  );
};

export default AISearchAssistant;

