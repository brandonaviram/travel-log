#!/bin/bash

# Travel Log - Arc Browser Launcher
# Starts the development server and opens the app in Arc browser

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PORT=8001
SERVER_PID_FILE="$SCRIPT_DIR/.server.pid"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[Travel Log]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[Travel Log]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[Travel Log]${NC} $1"
}

print_error() {
    echo -e "${RED}[Travel Log]${NC} $1"
}

# Function to check if server is running
is_server_running() {
    if [[ -f "$SERVER_PID_FILE" ]]; then
        local pid=$(cat "$SERVER_PID_FILE")
        if ps -p "$pid" > /dev/null 2>&1; then
            return 0
        else
            rm -f "$SERVER_PID_FILE"
            return 1
        fi
    fi
    return 1
}

# Function to start the server
start_server() {
    print_status "Starting development server on port $PORT..."
    
    cd "$SCRIPT_DIR"
    
    # Start Python HTTP server in background
    python3 -m http.server $PORT > /dev/null 2>&1 &
    local server_pid=$!
    
    # Save PID for later cleanup
    echo "$server_pid" > "$SERVER_PID_FILE"
    
    # Wait a moment for server to start
    sleep 2
    
    # Check if server started successfully
    if ps -p "$server_pid" > /dev/null 2>&1; then
        print_success "Development server started (PID: $server_pid)"
        return 0
    else
        print_error "Failed to start development server"
        rm -f "$SERVER_PID_FILE"
        return 1
    fi
}

# Function to stop the server
stop_server() {
    if is_server_running; then
        local pid=$(cat "$SERVER_PID_FILE")
        print_status "Stopping development server (PID: $pid)..."
        kill "$pid" 2>/dev/null || true
        rm -f "$SERVER_PID_FILE"
        print_success "Development server stopped"
    else
        print_warning "No server running"
    fi
}

# Function to check if Arc browser is available
check_arc() {
    if [[ ! -d "/Applications/Arc.app" ]]; then
        print_warning "Arc browser not found at /Applications/Arc.app"
        print_warning "Falling back to default browser"
        return 1
    fi
    return 0
}

# Function to open URL in Arc browser
open_in_arc() {
    local url="$1"
    local title="$2"
    
    if check_arc; then
        print_status "Opening $title in Arc browser..."
        open -a "Arc" "$url"
    else
        print_status "Opening $title in default browser..."
        open "$url"
    fi
}

# Function to show usage
show_usage() {
    echo "Travel Log - Arc Browser Launcher"
    echo ""
    echo "Usage: $0 [command]"
    echo ""
    echo "Commands:"
    echo "  start, run, dev     Start server and open Travel Log"
    echo "  test                Start server and open test runner"
    echo "  data                Start server and open data loader"
    echo "  stop                Stop the development server"
    echo "  restart             Restart the development server"
    echo "  status              Check server status"
    echo "  help                Show this help message"
    echo ""
    echo "Default: start"
}

# Function to show server status
show_status() {
    if is_server_running; then
        local pid=$(cat "$SERVER_PID_FILE")
        print_success "Development server is running (PID: $pid)"
        echo "  📱 Travel Log:    http://localhost:$PORT/"
        echo "  🧪 Tests:         http://localhost:$PORT/test.html"
        echo "  💾 Data Loader:   http://localhost:$PORT/load-data.html"
    else
        print_warning "Development server is not running"
    fi
}

# Function to restart server
restart_server() {
    print_status "Restarting development server..."
    stop_server
    sleep 1
    start_server
}

# Main execution
main() {
    local command="${1:-start}"
    
    case "$command" in
        "start"|"run"|"dev")
            if is_server_running; then
                print_warning "Server already running"
                show_status
            else
                if start_server; then
                    echo ""
                    show_status
                    echo ""
                fi
            fi
            
            print_status "Opening Travel Log application..."
            open_in_arc "http://localhost:$PORT/" "Travel Log"
            ;;
            
        "test")
            if ! is_server_running && ! start_server; then
                exit 1
            fi
            
            print_status "Opening test runner..."
            open_in_arc "http://localhost:$PORT/test.html" "Travel Log Tests"
            ;;
            
        "data")
            if ! is_server_running && ! start_server; then
                exit 1
            fi
            
            print_status "Opening data loader..."
            open_in_arc "http://localhost:$PORT/load-data.html" "Travel Log Data Loader"
            ;;
            
        "stop")
            stop_server
            ;;
            
        "restart")
            restart_server
            if is_server_running; then
                echo ""
                show_status
            fi
            ;;
            
        "status")
            show_status
            ;;
            
        "help"|"--help"|"-h")
            show_usage
            ;;
            
        *)
            print_error "Unknown command: $command"
            echo ""
            show_usage
            exit 1
            ;;
    esac
}

# Handle Ctrl+C gracefully
trap 'echo ""; print_status "Use '\''./start.sh stop'\'' to stop the server"; exit 0' INT

# Run main function with all arguments
main "$@"