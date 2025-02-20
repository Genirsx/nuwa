module nuwa_framework::ai_callback {
    use std::option;
    use std::vector;
    use std::string::{Self, String};

    use moveos_std::object;
    use moveos_std::string_utils;
    use moveos_std::json;
    
    use verity::oracles;

    use nuwa_framework::ai_service;
    use nuwa_framework::ai_response;

    /// AI Oracle response processing callback, this function must be entry and no arguments
    public entry fun process_response() {
        let pending_requests = ai_service::get_pending_requests();
        
        vector::for_each(pending_requests, |request_id| {
    
            let response_status = oracles::get_response_status(&request_id);
            
            if (response_status != 0) {
                let response = oracles::get_response(&request_id);
                let response_content = option::destroy_some(response);
                
                let message = if (response_status == 200) {
                    let json_str_opt = json::from_json_option<String>(string::into_bytes(response_content));
                    let json_str = if(option::is_some(&json_str_opt)){
                        option::destroy_some(json_str_opt)
                    }else{
                        response_content
                    };
                    let chat_completion_opt = ai_response::parse_chat_completion_option(json_str);
                    if(option::is_some(&chat_completion_opt)){
                        let chat_completion = option::destroy_some(chat_completion_opt);
                        let message_content = ai_response::get_message_content(&chat_completion);
                        
                        let refusal = ai_response::get_refusal(&chat_completion);
                        if(option::is_some(&refusal)){
                            let refusal_reason = option::destroy_some(refusal);
                            string::append(&mut message_content, string::utf8(b", refusal: "));
                            string::append(&mut message_content, refusal_reason);
                        };
                        message_content
                    }else{
                        response_content
                    }
                }else{
                    let error_message = string::utf8(b"AI Oracle response error, error code: ");
                    string::append(&mut error_message, string_utils::to_string_u32((response_status as u32)));
                    string::append(&mut error_message, string::utf8(b", response: "));
                    string::append(&mut error_message, response_content);
                    error_message
                };
                std::debug::print(&message);
                ai_service::remove_request(request_id);
            };
        });
        
    }
}